const mongoose = require('../database/index')

const RoomSchema = new mongoose.Schema({
    roomName:{
        type: String,
        require: true
    },

    creator:{
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        }
    },
    socketID:{
        type: String
    },
    description:{
        type: String
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },



    messages:[
        {
            name:{
                type: String,
                required: true
            },
            id:{
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
        }

    ],
    participants: [{
            name:{
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
            }
            ,status:{
                type: String,
            }
        }]

})



const privateRoom = mongoose.model('PrivateRoom', RoomSchema)
module.exports = privateRoom
