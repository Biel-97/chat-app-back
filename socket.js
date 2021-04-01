const { Rooms } = require('./utils/room')

let rooms = new Rooms()

const eventConnectionHandler = (socket_Server, io) => {
    console.log('usuario conectadoooo')



    socket_Server.on('new message', (data) => {

        io.to(data.room).emit('new message', data.message)
    })
    
    socket_Server.on('joinRoom', (data)=> {


        socket_Server.join(data.room)
        rooms.removeUser(socket_Server.id)
        rooms.addRoom(socket_Server.id, data.nome, data.room)
        // console.log(rooms.rooms)
        
        socket_Server.emit('new message', `Welcome to ${data.room}`)
        socket_Server.broadcast.to(data.room).emit(
            'new message',
             `${data.name} has been connected to ${data.room} room`)

    })


    socket_Server.on('disconnect', (data) => {
        let room = rooms.getRoom(socket_Server.id);
        // console.log(rooms.getRoomList())
        if(room){
            console.log(room)
            console.log('room name')
            io.to(room.room).emit('new message', 'A  user has left the chat.')
            rooms.removeUser(socket_Server.id);
        }   
    })

}

module.exports = eventConnectionHandler
