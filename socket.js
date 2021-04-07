const { Rooms } = require('./utils/room')
const privateRoom = require('./models/privateRoom')
const User = require('./models/user')

let rooms = new Rooms()

const eventConnectionHandler = (socket_Server, io) => {


  socket_Server.on('new message', (data) => {
    if (data.roomName == 'public') {
      io.to('public').emit('new message', data)
    } else {
      const newMessage = {
        name: data.UserName,
        message: data.message,
        id: data.User_ID,
        roomName: data.roomName
      }
      rooms.updateMessageRoom(data.room_ID, newMessage)
      
      io.to(data.room_ID).emit('new message', newMessage)

    }
  })

  socket_Server.on('joinRoom', (data) => {
    console.log('---')
    console.log(data)
    console.log('---')
    rooms.updatUserSocketID(data.User_ID, socket_Server.id, data.room_ID)

    if (data.roomName == 'public') {
      io.to('public').emit('new message', {
        email: 'Chat-Bot',
        UserName: 'Chat-Bot',
        message: `User ${data.UserName} has been joined the public room`,
        id: 'Chat-Bot-Id',
        roomName: 'public'
      })
      
      socket_Server.emit('new message', {
        email: 'Chat-Bot',
        UserName: 'Chat-Bot',
        message: `Welcome to public room`,
        id: 'Chat-Bot-Id',
        roomName: 'public'
      })
    }


    socket_Server.join(data.room_ID)


    socket_Server.on('exitRoom', async (exitData) => {
      console.log('saida')
      socket_Server.leave(exitData.room_ID)

    })

  })


  socket_Server.on('disconnect',  async () => {
    socket_Server.leave(await rooms.getUserRoomName(socket_Server.id))

  })

}

module.exports = eventConnectionHandler
