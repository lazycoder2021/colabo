const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true
    }, 
    password: {
        type: String,
        required: true,
        unique: true
    }, 
    isWriter: {
        required: false,
        type: Boolean, 
        default: true
    }, 
    isReviewer: {
        required: false,
        type: Boolean,
        default: false
    },
    isApprover: {
        required: false,
        type: Boolean,
        default: false
    },
    isAdmin: {
        required: false,
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User; 
