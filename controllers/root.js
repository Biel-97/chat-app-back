const express = require('express')
const User = require('../models/user')
const privateRoom = require('../models/privateRoom')
const privateChatRoom = require('../models/PrivateChat')
const router = express.Router()

const { authenticateToken } = require('../middlewares/middleware')

router.post('/', authenticateToken, async (req, resp) => {
  try {
    const User_ID = req.body.id

    const currentUser = await User.findOne({ _id: User_ID })
    if (currentUser) {
      return resp.send(currentUser)
    } else {
      return res.status(400).send({ error: 'error' })
    }

  } catch (error) {
    return resp.send({ error: 'error' })
  }
})

router.get('/users', (req, res) => {
  try {
    User.find()
      .exec((err, users) => {
        if (err) {
        } else {
          res.send(users);
        }
      });
  } catch (error) {
    console.log('erro')
  }



});

router.post('/addContact', authenticateToken, async (req, res) => {

  try {
    const User_ID = req.body.id
    const email = req.body.email
    const contact = {
      email
    }
    if (await User.findOne({ _id: User_ID, email: email })) {
      return res.send({ error: 'This is your email.' })
    }
    if (!await User.findOne({ email })) {
      return res.send({ error: 'User not found.' })
    } else {
      let user = await User.findOne({ email })
      contact.name = user.name
      contact._id = user._id
    }
    const userCurrent = await User.findOne({ _id: User_ID ,'contacts.email': email} )

    if(userCurrent != null){
        return res.send({ error: 'User allready added.' })
    }
    User.findOneAndUpdate(
      { _id: req.body.id },
      { $push: { contacts: contact } }, (err, data) => {
        if (err) {
          console.log('update error')
          res.send({ error: 'Contact error.' })

        } else {
          console.log('query salvo')
          res.send({ ok: 'ok' })
        }
      }
    )
  } catch (error) {
    // console.log('erro')
  }


});


router.post('/getContact', authenticateToken, async (req, res) => {

  try {
    const User_ID = req.body.id
    res.send({ User: await User.findOne({ _id: User_ID }) })

  } catch (error) {
    console.log('erro')
  }


});


router.post('/newGroup', authenticateToken, async (req, res) => {
  try {
    if(req.body.room.roomName == 'public'){
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
      const currentChat = await privateRoom.findOne({ _id: chat_ID }) || await privateChatRoom.findOne({_id: chat_ID})
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
    const currentUser = await User.findOne({ _id: User_ID})

    if (currentUser) {
      return resp.send(currentUser.Rooms.Room_id == Room_ID)
    } else {
      return res.status(400).send({ error: 'error' })
    }
    
  } catch (error) {
    return resp.send({ error: 'erro aqui' })
  }
})
module.exports = app => app.use('/', router)