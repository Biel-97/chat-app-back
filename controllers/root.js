const express = require('express')
const User = require('../models/user')
const privateRoom = require('../models/privateRoom')
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
    }
    if (await User.findOne({ _id: User_ID, contacts: { email } })) {
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
    const CurrentRoom = await privateRoom.create(req.body.room)

    let participants = req.body.room.participants
    const Room = {
      name: CurrentRoom.roomName,
      Room_id: CurrentRoom._id
    }


    participants.forEach(async element => {

      await User.findOneAndUpdate({ email: element.email },
          {$push: {
            Rooms: Room
          }
        }, (err, data) => {
          if (err) {
            console.log(err)
            res.send({ error: 'new group error' })
            
          } else {
            console.log('query salvo')
          }
        }
        )
      

    })
    res.send({ ok: 'ok' })


  } catch (error) {
    console.log(error)
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
    console.log('erro')
  }


});


router.post('/groupMessages', authenticateToken, async (req, res) => {

  try {
    const chat_ID = req.body.chatId
    if (chat_ID) {
      const currentChat = await privateRoom.findOne({ _id: chat_ID })
      console.log(currentChat.messages)
      res.send({ messages: currentChat.messages })
    } else {
      res.send({ error: 'Chat without a id.' })
    }

  } catch (error) {
    console.log(error)
    res.send({ error: error })
  }


});

module.exports = app => app.use('/', router)
