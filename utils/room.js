const { privateRoom } = require('../models/privateRoom')

class Rooms {
    constructor() {
      this.rooms = [{ 
      socketID: 'wQkJ2G667CwZCcugAAAL',
      participant: 'Nome qualquer no bd',
      roomName: 'Sala  qualquer no bd'
     }];
    }
  
    addRoom(socketID, name, roomName) {
      let roomCreate = {socketID, name, roomName};
      this.rooms.push(roomCreate);

      return roomCreate;
    }
  
    getRoomList (roomName) {
      let rooms = this.rooms.filter((room) => room.room === roomName);
      let namesArray = rooms.map((room) => room.name);

      return namesArray;
    }
  
    getRoom(socketID) {
      // console.log(await privateRoom.findOne({ email }))
      return this.rooms.filter((room) => room.socketID === socketID)[0];
    }
  
    removeUser(socketID) {
      let user = this.getRoom(socketID);
      if(user){
        this.rooms = this.rooms.filter((user) => user.socketID !== socketID);
      }
  
      return user;
    }
  
  }
  
  module.exports = {Rooms}