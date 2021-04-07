const express = require('express')
const router = express.Router()

const PrivateChat = require('../models/PrivateChat')
const User = require('../models/user')

const { authenticateToken } = require('../middlewares/middleware')


router.get('/abc', (req, res)=> {
    try {
        PrivateChat.find()
        .exec((err, privatemsg) => {
          if (err) {
          } else {
            res.send(privatemsg);
          }
        });
    } catch (error) {
        
    }
})

router.post('/newPrivateChat', authenticateToken, async (req, res) => {
    try {
        const UserID = req.body.id
        const contactId = req.body.contactId._id
        const userInfo = {
          _id: UserID,
          email: req.body.email,
          name: req.body.name
        }
        const contactInfo = req.body.contactId
        console.log(contactInfo)
        const chat = await PrivateChat.findOne({personsID: [UserID ,contactId]}) || await PrivateChat.findOne({personsID: [contactId, UserID]})
        console.log(userInfo)
        if(chat != null){
            console.log('Chat already exist.')
            return res.send({chatId: chat._id})
          }else{
            const newPrivateChat = await PrivateChat.create({personsID: [UserID, contactId]})

            contactInfo.chatId = newPrivateChat._id
            userInfo.chatId = newPrivateChat._id

            await User.findOneAndUpdate( {_id: UserID},
              {$push: {privateChatIds: contactInfo}}   )
              
            await User.findOneAndUpdate( {_id: contactId},
                {$push: {privateChatIds: userInfo}}   )
            console.log('ok')
            return res.send({ok: newPrivateChat.id})
        }
          
    } catch (error) {
      res.send({ error: 'error' })
    }
  });

  router.post('/getPrivateChat',authenticateToken, (req, res)=> {

    try {
      // const User_ID = req.body.id
      // res.send({ User: await PrivateChat.findOne({ _id: User_ID }) })
  
    } catch (error) {
      console.log('erro')
    }
    
})

module.exports = app => app.use('/private', router)