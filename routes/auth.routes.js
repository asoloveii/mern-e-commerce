const router = require('express').Router()
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

router.post('/register', async (req, res) => {

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
  })

  try {
    const savedUser = await newUser.save()

    res.status(201).json({ success: true, user: savedUser })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    !user && res.status(401).json('Wrong pass')

    const hashPass = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    const dcpassword = hashPass.toString(CryptoJS.enc.Utf8)

    dcpassword !== req.body.password && res.status(500).json('Wrong pass')
    const accessToken = jwt.sign({
      id: user._id, isAdmin: user.isAdmin
    }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })

    const { password, ...data } = user._doc
    res.status(200).json({ success: true, user: data, accessToken })
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
