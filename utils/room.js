const PrivateRoom = require('../models/privateRoom')
const privateChat = require('../models/PrivateChat')
const User = require('../models/user')

class Rooms {
  constructor() { }

  async updatsocketID(userID, socketID, currentRoomName) {
    User.findOneAndUpdate(
      { _id: userID },
      { socketID: socketID } )


    User.findOneAndUpdate(
      { _id: userID },
      { currentRoomName: currentRoomName } )
  }


  async getUserRoomName(socketID) {
      const room = (await User.findOne({ socketID: socketID }) == null) == true? 'public': await User.findOne({ socketID: socketID })
      if(room == 'public'){
        return 'public'
      }else{
        return  await room.currentRoomName
      }
  }


  async updateMessageRoom(roomID, newMessage, io) {
    if (await PrivateRoom.findOne({ _id: roomID }) != null) {
      
      await PrivateRoom.findOneAndUpdate(
        { _id: roomID },
        { $push: { messages: newMessage } })
      }
      
      if (await privateChat.findOne({ _id: roomID }) != null) {
        
        await privateChat.findOneAndUpdate(
          { _id: roomID },
          { $push: { messages: newMessage } }
          )
        }
        io.to(roomID).emit('new message', newMessage)      
  }

}

module.exports = { Rooms }