const { privateRoom } = require('../models/privateRoom')

const PrivateRoom = require('../models/privateRoom')

class Rooms {
  constructor() {
    this.rooms = [{
      socketID: '',

      roomName: ''
    }];
  }


  getRoomList(roomName) {
    let rooms = this.rooms.filter((room) => room.room === roomName);
    let namesArray = rooms.map((room) => room.name);

    return namesArray;
  }

  getRoom(socketID) {
    return this.rooms.filter((room) => room.socketID === socketID)[0];
  }

  removeUser(socketID) {
    let user = this.getRoom(socketID);
    if (user) {
      this.rooms = this.rooms.filter((user) => user.socketID !== socketID);
    }

    return user;
  }

  updatUserSocketID(userID, socketID, currentRoomName) {
    console.log(socketID)
    User.findOneAndUpdate(
      { _id: userID },
      { socketID },
      { currentRoomName },
      (err, user) => {
        if (err) {
          console.log('update error')
          res.send({ error: err })
        } else {
          // console.log('tudo ok')
        }
      }
    )
  }
  async getUserRoomName(socketID) {
    const room = await PrivateRoom.findOne({ socketID })
    console.log(room)
    return room
  }
  async addRoom(roomID, socketID) {
    await PrivateRoom.findOneAndUpdate(
      { _id: roomID },
      { socketID: socketID })
    return 'ok'
  }
  async updateMessageRoom(roomID, socketID, newMessage) {

    await PrivateRoom.findOneAndUpdate(
      { _id: roomID },
      { socketID: socketID },
      { $push: { messages: newMessage } }  , (err, data) => {
        if (err) {
          res.send({ error: err })
        } else {
          console.log('mensagem salvada')
        }
      }
    )
  }


}

module.exports = { Rooms }