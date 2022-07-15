const mongoose = require('mongoose');

const approveSchema = mongoose.Schema({
    approvalComments: {
        type: String,
        required: true, 
    },
    status: {
        type: String,
        required: true,
    }, 
    docid: {
        type: String,
        required: true,
    }
})

const Approve = mongoose.model('Approve', approveSchema);

module.exports = Approve; 

