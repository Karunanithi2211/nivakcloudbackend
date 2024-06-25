const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse")

exports.signUp = async (req, res, next) => {
    const {email} = req.body;
    const {userId} = req.body;
    console.log("userID: "+ userId);
    const userExist = await User.findOne({email})
    const userIdExist = await User.findOne({userId})

    if(userExist){
        return next(new ErrorResponse("Email alread  exists", 400));
    }

    if(userIdExist){
        return next(new ErrorResponse("UserId alread  exists", 400));
    }

    try {
        const user = await User.create(req.body);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error)
    }
} 


exports.signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return next(new ErrorResponse("Email and password are required", 400));
        }
        
        // CHECK USER EMAIL
        const user = await User.findOne({email});
        if(!user){
            return next(new ErrorResponse("Invalid Credentials", 400));
        }

        // VERIFY USER PASSWORD
        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return next(new ErrorResponse("Invalid Credentials", 400));
        }

        generateToken(user, 200, res);

    } catch (error) {
        next(new ErrorResponse("Cannot log in, check your credentials", 400));
    }
}

const generateToken = async (user, statusCode, res) => {
    const token = await user.jwtGenerateToken();
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + (1*60*60*1000)),
      };

    res
      .status(statusCode)
      .cookie('token', token, options )
      .json({success: true, token})
}

exports.logOut = (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
}


exports.userProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
}


exports.singleUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
} 

exports.updateProfile = async (req, res, next) => {
    const email = req.body.email;
    const url = req.body.profileURL;
    console.log(email+ ": "+url);
    try {
        const user = await User.findOneAndUpdate(
            { email: email },
            { profileURL: url },
            { new: true, runValidators: true } // new: true returns the updated document
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile Image Updated Successfully"
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
   res.status(200)
}