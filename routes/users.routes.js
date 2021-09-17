const router = require('express').Router()
const User = require('../models/User')
const { verifyTokenAuth, verifyTokenAdmin } = require('./verifyToken')

router.put('/:id', verifyTokenAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, { new: true })

    res.status(200).json({ success: true, user: updatedUser })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', verifyTokenAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json('User has been deleted')
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/:id', verifyTokenAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const { password, ...data } = user._doc

    res.status(200).json({ success: true, user: data })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/', verifyTokenAdmin, async (req, res) => {
  const query = req.query.new

  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()

    res.status(200).json(users)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/stats', verifyTokenAdmin, async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: '$createdAt' } },
      { $group: { _id: '$month', total: { $sum: 1 } } }
    ])

    res.status(200).json({ success: true, data })
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
