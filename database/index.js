const mongoose = require('mongoose')

mongoose.Promise = global.Promise

let db = 'mongodb://localhost/chat-app'


mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => {
        console.log('mongoDB started ')
    }).catch((err) => {
        console.log('MongoDB ERROR - '+ err)
    })

module.exports = mongoose
