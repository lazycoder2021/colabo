const mongoose = require('mongoose'); 

const docSchema = mongoose.Schema({
    userId: {
        type: String, 
        required: true
    }, 
    title: {
        type: String, 
        required: true
    }, 
    body: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        required: false, 
        default: "inprogress"
    }
})

const Doc = mongoose.model('Doc', docSchema);

module.exports = Doc; 
