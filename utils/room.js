const PrivateRoom = require('../models/privateRoom')
const privateChat = require('../models/PrivateChat')
const User = require('../models/user')

class Rooms {
  constructor() { }


  async updatUserSocketID(userID, socketID, currentRoomName) {
    User.findOneAndUpdate(
      { _id: userID },
      { userSocketID: socketID },
      (err, user) => {
        if (err) {
          console.log('update error')
          res.send({ error: err })
        } else {
          console.log('socket id do usuario atualizado')
        }
      }
    )

    
    User.findOneAndUpdate(
      { _id: userID },
      { currentRoomName: currentRoomName },
      (err, user) => {
        if (err) {
          console.log('update error')
          res.send({ error: err })
        } else {
          console.log('CurrentRoom do usuario atualizado')
        }
      }
    )
  }





  async getUserRoomName(socketID) {
    const room = await User.findOne({ userSocketID: socketID })
    const currentRoom = await room.currentRoomName
    return currentRoom
  }

  async updateMessageRoom(roomID, newMessage) {
    console.log(newMessage)
    if (await PrivateRoom.findOne({ _id: roomID }) != null) {

      console.log('mensagem do grupo')
      await PrivateRoom.findOneAndUpdate(
        { _id: roomID },
        { $push: { messages: newMessage } } )
    }
    
    if (await privateChat.findOne({ _id: roomID }) != null) {
      
      console.log('mensagem do chat privado')
      await privateChat.findOneAndUpdate(
        { _id: roomID },
        { $push: { messages: newMessage } }
      )
    }

  }


}

module.exports = { Rooms }