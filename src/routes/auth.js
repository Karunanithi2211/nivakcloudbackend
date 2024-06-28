const express = require('express');
const router = express.Router();
const { signUp, signIn, logOut, singleUser, userProfile, updateProfile} = require("../controllers/user");
const { isAuthenticated } = require('../middleware/auth');
const { findAllFolderAndFile, createFolderInCloud, allFiles, deleteFile, deleteFolder } = require('../controllers/cloudinary');
const fileUpload = require('express-fileupload');


router.use(fileUpload())

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/logout', logOut);
router.post('/getme', isAuthenticated);
router.get('/user/:id', singleUser);
router.post('/cloud/allfolderfiles', findAllFolderAndFile)
router.post('/cloud/createfolder', createFolderInCloud)
router.post('/cloud/allfiles', allFiles)
router.post('/cloud/deletefile', deleteFile)
router.post('/cloud/deletefolder', deleteFolder)
router.post('/updateprofile', updateProfile)

module.exports = router; 
