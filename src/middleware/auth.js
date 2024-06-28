const jwt = require('jsonwebtoken')
const User = require('../models/user')
const ErrorResponse = require('../utils/errorResponse');
const { userProfile } = require('../controllers/user');


exports.isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token || req.data.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized Token not found'+token });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        userProfile();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized '+ error });
    }
};