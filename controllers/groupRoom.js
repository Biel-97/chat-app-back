const express = require('express')
const User = require('../models/user')
const privateRoom = require('../models/privateRoom')
const privateChatRoom = require('../models/PrivateChat')
const router = express.Router()

const { authenticateToken } = require('../middlewares/middleware')

router.post('/newGroup', authenticateToken, async (req, res) => {
  try {
    if (req.body.room.roomName == 'public') {
      return res.send({ error: 'public name are unavailable, choose another.' })

    }
    const CurrentRoom = await privateRoom.create(req.body.room)
    let participants = req.body.room.participants

    const room = {
      name: CurrentRoom.roomName,
      Room_id: CurrentRoom._id
    }

    participants.forEach(element => {
      User.findOneAndUpdate(
        { email: element.email },
        { $push: { Rooms: room } }, (err, data) => {
          if (err) {
            res.send({ error: 'error to create the group.' })
          } else {
            console.log('tudo ok')
          }
        }
      )
    });
    res.send({ ok: 'ok' })


  } catch (error) {
    res.send({ error: error })
  }


});
router.get('/getgroups', async (req, res) => {

  try {
    privateRoom.find()
      .exec((err, groups) => {
        if (err) {
        } else {
          res.send(groups);
        }
      });

  } catch (error) {
    console.log('/getgroups ---erro')
  }
});


router.post('/groupMessages', authenticateToken, async (req, res) => {

  try {
    const chat_ID = req.body.chatId
    if (chat_ID) {
      const currentChat = await privateRoom.findOne({ _id: chat_ID }) || await privateChatRoom.findOne({ _id: chat_ID })
      res.send({ messages: currentChat.messages, description: currentChat.description })
    } else {
      res.send({ error: 'Chat without a id.' })
    }
  } catch (error) {
    res.send({ error: 'errorr' })
  }

});


router.post('/authRoom', authenticateToken, async (req, resp) => {
  try {
    const User_ID = req.body.id
    const Room_ID = req.body.roomId
    const currentUser = await User.findOne({ _id: User_ID })

    if (currentUser) {
      return resp.send(currentUser.Rooms.Room_id == Room_ID)
    } else {
      return res.status(400).send({ error: 'error' })
    }

  } catch (error) {
    return resp.send({ error: 'erro aqui' })
  }
})


router.post('/leaveRoom', authenticateToken, async (req, resp) => {
  try {
    const User_ID = req.body.id
    const GroupID = req.body.GroupID
    const user = await User.findOne({ _id: User_ID })
    
    await privateRoom.updateOne(
      { _id: GroupID },
      { "$pull": { "participants": { "email": user.email } } },
      { safe: true, multi: true })
      
      await User.updateOne(
        { _id: User_ID },
        { "$pull": { "Rooms": { "Room_id": GroupID } } },
        { safe: true, multi: true })
        
        const group = await privateRoom.findOne({ _id: GroupID })
        if (group.participants.length == 0) {
          await privateRoom.remove({ _id: GroupID })
          return resp.send({ ok: 'ok' })
        }
        
        const currentGroupStatus = await privateRoom.findOne({ _id: GroupID, 'participants.status' : 'administrator' })
        if(currentGroupStatus == null){
          let randomParticipantNumber = Math.floor(Math.random() * group.participants.length) + 0
          let participant = group.participants[randomParticipantNumber]
          participant.status = 'administrator'
          await privateRoom.updateOne(
            { _id: GroupID },
            { "$pull": { "participants": { "email": participant.email } } },
            { safe: true, multi: true })

          await privateRoom.updateOne(
            { _id: GroupID },
            { "$push": { "participants": participant } },
            { safe: true, multi: true })
          
    }

    return resp.send({ ok: 'ok' })
  } catch (err) {
    console.log(err)
    return resp.send({ err: 'erro aqui' })
  }
})

router.post('/groupParticipants', authenticateToken, async (req, resp) => {
  try {
    const GroupID = req.body.GroupID
    const Room = await privateRoom.findOne({ _id: GroupID })

    resp.send({
      createdAt: Room.CreatedAt,
      creator: Room.creator,
      description: Room.description,
      participants: Room.participants,
      roomName: Room.roomName
    })
  } catch (err) {
    return resp.send({ err: err })
  }
})

router.post('/removefromgroup', authenticateToken, async (req, res) => {

  try {
    const GroupID = req.body.groupId
    const contactEmail = req.body.contactEmail
    const userEmail = req.body.userEmail
    const room = await privateRoom.findOne({ _id: GroupID })

    const contact = room.participants.filter((element) => {
      return element.email == contactEmail
    })
    const user = room.participants.filter((element) => {
      return element.email == userEmail
    })

    const contactStatus = (contact[0].status === undefined) ? undefined : contact[0].status
    const userStatus = (user[0].status === undefined) ? undefined : user[0].status

    if (contactStatus !== undefined) {
      return res.send({ error: 'Error, Cannot remove an administrator.' })
    } if (userStatus == undefined) {
      return res.send({ error: 'Error, You are not an administrator.' })
    }

    await privateRoom.updateOne(
      { _id: GroupID },
      { "$pull": { "participants": { "email": contactEmail } } },
      { safe: true, multi: true })
      
      await User.findOneAndUpdate(
        { 'email': contactEmail },
        {'$pull': { Rooms: {Room_id: GroupID} } }
      )

    res.send({ ok: 'ok' })
  } catch (error) {
    console.log(error)
    res.send({ error: error })
  }

});
router.post('/addingroup', authenticateToken, async (req, res) => {
  const GroupID = req.body.groupId
  const contactId = req.body.userId
  try {
    const currentRoom = await privateRoom.findOne({ _id: GroupID })

    const contact = await User.findOne({ '_id': contactId })
    const room = await privateRoom.findOne({ _id: GroupID, 'participants.email': contact.email })
    if (room != null) {
      return res.send({ error: 'User allready added.' })
    }

    const contactInfo = {
      email: contact.email,
      name: contact.name,
      _id: contact._id
    }
    const roomInfo = {
      Room_id: currentRoom._id,
      name: currentRoom.roomName
    }
    
    
    await User.findOneAndUpdate(//garante que nao salve o usuario duas vezes
      { '_id': contactId },
      { $pull: { Rooms: roomInfo }})
    await privateRoom.findOneAndUpdate(//atualiza o grupo
      { _id: GroupID },
      { $push: { participants: contactInfo }})
    await User.findOneAndUpdate(//atualiza o usuario
      { '_id': contactId },
      { $push: { Rooms: roomInfo }})
        
        console.log('+1')
        res.send({ ok: 'ok' })
  } catch (error) {
    console.log(error)
    res.send({ error: error })
  }

});

module.exports = app => app.use('/group', router)