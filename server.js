const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socket = require('./socket')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json());

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200"
  }
});

require('./controllers/authController')(app)
require('./controllers/root')(app)
require('./controllers/PrivateChatRoom')(app)
require('./controllers/groupRoom')(app)
require('./controllers/contact')(app)
io.on('connection', (socket_Server) => socket(socket_Server, io))



server.listen(process.env.PORT || 8080, console.log('server iniciado'))