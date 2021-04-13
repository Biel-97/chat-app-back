const express = require('express')
const User = require('../models/user')
const PrivateChat = require('../models/PrivateChat')
const router = express.Router()

const { authenticateToken } = require('../middlewares/middleware')


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
    const userCurrent = await User.findOne({ _id: User_ID, 'contacts.email': email })

    if (userCurrent != null) {
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
    console.log('error')
    resp.send({error: error})
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

router.post('/deleteContact', authenticateToken, async (req, res) => {
  try {
    const UserId = req.body.id
    let contactToDelet = req.body.privateChatId
    let privateChat = await PrivateChat.findOne({ personsID: [req.body.privateChatId, req.body.id] }) || await PrivateChat.findOne({ personsID: [req.body.id, req.body.privateChatId] })

    if (privateChat !== null) {
      const ChatID = privateChat._id
      await PrivateChat.remove({ _id: privateChat._id })

      const user = await User.updateOne(
        { _id: UserId },
        { "$pull": { "privateChatIds": { "chatId": ChatID } } },
        { safe: true, multi: true })

      const contact = await User.updateOne(
        { _id: contactToDelet },
        { "$pull": { "privateChatIds": { "chatId": ChatID } } },
        { safe: true, multi: true })
      }
    await User.updateOne(
      { _id: UserId },
      { "$pull": { "contacts": { "_id": contactToDelet } } },
      { safe: true, multi: true })
      
    return res.send({ ok: 'ok' })
  } catch (error) {
    console.log(error)
    return res.send({ error: error })
  }
});


module.exports = app => app.use('/contact', router)