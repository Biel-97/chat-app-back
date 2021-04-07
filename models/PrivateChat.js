const mongoose = require('../database/index')
const PrivateSchema = new mongoose.Schema({

    personsID: [String],
    messages: [{
        name: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }],


})



const PrivateChat = mongoose.model('PrivateChat', PrivateSchema)
module.exports = PrivateChat

