const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user')
require('dotenv').config()

router.post('/register', async (req, res)=> {
    const { email, name, password } = req.body

    try {
        // if (!email && !name && !password) return res.send({ error: 'Please, fill the fields below.' })
        // if (!name) return res.send({ error: 'Name field is empty' })
        // else if (name.length <= 3) return res.send({ error: 'Name too short' })
        // if (!email) return res.send({ error: 'Email field is empty' })
        // if (!password) return res.send({ error: 'Password field is empty' })
        // else if (password.length <= 3) return res.send({ error: 'Password shorter than 3 caracteres.' })
        // else if (password.length >= 10) return res.send({ error: 'Password bigger than 10 caracteres.' })
        
        if (await User.findOne({ email })) {
            return res.send({ error: 'Email alread registred' })
        } else {
            
            const userInfo = await User.create(req.body)
            userInfo.password = undefined
            const token = jwt.sign({ id: userInfo.id }, process.env.TOKEN_HASH, { expiresIn: 44000 })
            return res.send({ userInfo, token })
        }
    } catch (err) {
        return res.send({ error: 'Registration fail', err })
    }

  })


router.post('/login',  async (req, res) => {
    const { email, password } = req.body

    if (!email && !password) return res.send({ error: 'Please, fill the fields below.' })
    if (!password) return res.send({ error: 'Password field is empty' })
    if (!email) return res.send({ error: 'Email field is empty' })

    console.log(email, password)
    const userInfo = await User.findOne({ email }).select('+password')
    if (!userInfo) {
        return res.send({ error: 'User not found' })
    }
    else {
        if (await bcrypt.compare(password, userInfo.password)) {
            userInfo.password = undefined
            const token = jwt.sign({ email: userInfo.email }, process.env.TOKEN_HASH, { expiresIn: 44000 })

            return res.send({ userInfo, token })
        } else {
            return res.send({ error: 'senha incompativel' })
        }
    }

})

module.exports = app => app.use('/auth', router)