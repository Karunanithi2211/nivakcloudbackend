const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ErrorResponse = require('../utils/errorResponse')


exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    // MAKE SURE TOKEN EXISTS
    if(!token){
        return next(new ErrorResponse('You must login to access this ressource', 401))
    }

    try {
        // VERIFY THE TOKEN
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id)
        next()
    } catch (error) {
        return next(new ErrorResponse('You must login to access this ressource', 401))
    }
}