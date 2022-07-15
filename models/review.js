const mongoose = require('mongoose'); 

const reviewSchema = mongoose.Schema({
    docId: {
        type: String, 
        required: true
    },
    remarks: {
        type: String, 
        required: true
    }, 
    status: {
        type: String, 
        required:true
    }
})

const Review = mongoose.model('Review', reviewSchema); 

module.exports = Review; 
