const express = require('express')
const axios = require('axios')
const ErrorResponse = require('../utils/errorResponse')
var cloudinary = require('cloudinary');


const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
const api_key = process.env.CLOUDINARY_API_KEY
const api_secret = process.env.CLOUDINARY_API_SECRET


cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
    secure: true
   });


exports.createFolderInCloud = async (req, res, next) => {
    const folderName = req.body.folderName
    console.log(folderName);
    try{
        await cloudinary.api.create_folder(folderName)
        res.status(200).json({success: true, message: "successfull"})
    }
    catch(error) {
        next(new ErrorResponse(`Error in Creating folder`, 400))
    }
}
   

exports.findAllFolderAndFile = async (req, res, next) => {
    const path = req.body.folderPath;
    try {
        const paths = {
            folders: [],
            files:[{}],
        }

        //FOR FOLDERS
        const folderPaths = await cloudinary.v2.api.sub_folders(path);
        if(folderPaths.folders)
            paths.folders = folderPaths.folders.map(folder => ({
                name: folder.name,
                path: folder.path
            }));

        //FOR FILES
        const filePaths =  await cloudinary.v2.search.expression(
        `folder: ${path}`
        ).sort_by('public_id','desc').execute()
        console.log(filePaths.resources);
        if(filePaths.resources)
            paths.files = filePaths.resources.map(file => ({
                public_id: file.public_id,
                filename: file.filename,
                folder: file.folder,
                resource_type: file.resource_type,
                url: file.url
            }));

        res.status(200).json({success: true, paths})

    } catch (error) {
        next(new ErrorResponse(`Error fetching folders and files for path ${path}`, 400))
    }
}

exports.allFiles = async (req, res, next) => {
    const path = req.body.userId;
    
    try {
        const paths = {
            files:[{}],
        }

        //FOR FILES
        const filePaths =  await cloudinary.v2.search.expression(
        `folder: ${path}*`
        ).sort_by('public_id','desc').execute()

        if(filePaths.resources)
            paths.files = filePaths.resources.map(file => ({
                filename: file.filename,
                folder: file.folder,
                resource_type: file.resource_type,
                url: file.url
            }));

        res.status(200).json({success: true, paths})

    } catch (error) {
        next(new ErrorResponse(`Error fetching folders and files for path ${path}`, 400))
    }
};


exports.deleteFolder = async (req, res, next) => {
    const folderName = req.body.folderPath;
    console.log("folderName received: ",folderName);
    try {
        const deleteFile = await cloudinary.api.delete_resources_by_prefix(folderName + "/");
        console.log("DeletedFile result: ", deleteFile);
        
        const deleteFolder = await cloudinary.api.delete_folder(folderName);
        console.log("DeletedFolder result: ", deleteFolder);
        res.status(200).json({ success: true, message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error in deleting folder:', error);
        next(new ErrorResponse('Error in deleting folder', 400));
    }
};

exports.deleteFile = async (req, res, next) => {
    const fileName = req.body.fileName;
    try {
      const result = await cloudinary.uploader.destroy(fileName);
      console.log(result);
      if (result.result !== 'ok') {
        return next(new ErrorResponse('Error in deleting file', 400));
      }
      res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
      console.error(error);
      next(new ErrorResponse('Error in deleting file', 400));
    }
  };