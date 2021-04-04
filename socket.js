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
      privateRoom.findOneAndUpdate(
          { _id: data.room_ID },
          { $push: { messages: newMessage } }, (err, data) => {
              if (err) {
                  res.send({ error: err })
              } else {
              }
          }
      )


      io.to(data.roomName).emit('new message', newMessage)

    }
  })

  socket_Server.on('joinRoom', (data) => {
    // console.log(socket_Server.id)

    // rooms.updatUserSocketID(data.User_ID, socket_Server.id, data.roomName)


    socket_Server.join(data.roomName)

    socket_Server.on('exitRoom', (exitData)=> {
      socket_Server.leave(exitData.roomName)

    })



    // rooms.removeUser(socket_Server.id)
    // rooms.addRoom(socket_Server.id, data.name, data.roomName)

    // socket_Server.emit('new message', `Welcome to ${data.room}`)
    // socket_Server.broadcast.to(data.room).emit(
    //     'new message',
    //      `${data.name} has been connected to ${data.room} room`)

    console.log('_________')
  })


  socket_Server.on('disconnect', () => {
    // console.log(socket_Server.id)
    // socket_Server.leave(socket_Server.id)
    console.log(socket_Server.rooms)


  })

}

module.exports = eventConnectionHandler
