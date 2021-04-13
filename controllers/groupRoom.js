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

    const groupLength = await privateRoom.findOne({ _id: GroupID })

    if (groupLength.participants.length == 0) {
      console.log('grupo vazio, deletando-o')
      await privateRoom.remove({ _id: GroupID })
    }
    resp.send({ ok: 'ok' })
  } catch (err) {
    console.log(err)
    return resp.send({ err: 'erro aqui' })
  }
})

router.post('/groupParticipants', authenticateToken, async (req, resp) => {
  try {
    const GroupID = req.body.GroupID
    const Room = await privateRoom.findOne({ _id: GroupID })
    
    resp.send(Room.participants)
  } catch (err) {
    return resp.send({ err: err})
  }
})

module.exports = app => app.use('/group', router)