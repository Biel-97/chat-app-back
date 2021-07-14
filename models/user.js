const mongoose = require('../database/index')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    currentRoomName: {
        type: String,
    },
    Rooms:
        [{
            name: {
                type: String,
                require: true
            },
            Room_id: {
                type: String,
                require: true
            }
        }],
    contacts: [{
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        }
    }],
    privateChatIds: [{}],
    socketID: {},

})

userSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

const user = mongoose.model('user', userSchema)
module.exports = user
