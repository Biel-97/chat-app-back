const mongoose = require('../database/index')
const bcrypt = require('bcryptjs')

const PrivateSchema = new mongoose.Schema({

    persons: [{
            name: {
                type: String,
                required: true

            },
            email: {
                type: String,
                required: true
            },
        }],
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



const privateMessage = mongoose.model('PrivateRoom', PrivateSchema)
module.exports = privateMessage
