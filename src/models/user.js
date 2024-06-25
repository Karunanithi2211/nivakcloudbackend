const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please add a name"],
        maxlength: 32
    },

    userId: {
        type: String,
        required: [true, "Please add a UserId"],
        unique:true,
    },

    email: {
        type: String,
        trim: true,
        required: [true, "Please add a email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid E-mail'
        ] 
    },

    password: {
        type: String,
        trim: true,
        required: [true, "Please add a password"],
        minlength: [6, 'password must have at least six(6) characters'],
        match: [
           /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
           'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and a special characters'
        ]
    },

    verificationNumber: {
        type: Number,
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    profileURL: {
        type: String
    }

}, {timestamps: true});

// ENCRYPTING PASSWORD
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// VERIFY PASSWORD
userSchema.methods.comparePassword = async function(yourPassword){
    return await bcrypt.compare(yourPassword, this.password);
}

// GET THE TOKEN
userSchema.methods.jwtGenerateToken = function () {
    return jwt.sign({id: this.id}, process.env.JWT_SECRET,{
        expiresIn: 3600000
    })
}

module.exports = mongoose.model("users", userSchema);