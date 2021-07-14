const mongoose = require('mongoose')
require('dotenv').config()

mongoose.Promise = global.Promise

let db = process.env.MONGO_DB_ACESS?process.env.MONGO_DB_ACESS:'mongodb://localhost/chat-app'

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(db)
.then( () => {
        console.log('mongoDB started ')
    }).catch((err) => {
        console.log('MongoDB ERROR - '+ err)
    })

module.exports = mongoose
