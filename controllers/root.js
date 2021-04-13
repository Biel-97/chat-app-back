const express = require('express')
const User = require('../models/user')
const PrivateChat = require('../models/PrivateChat')
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
router.get('/privatechat', (req, res) => {
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

module.exports = app => app.use('/', router)