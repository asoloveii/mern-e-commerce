const router = require('express').Router()
const Cart = require('../models/Cart')
const { verifyTokenAdmin, verifyTokenAuth } = require('./verifyToken')

router.post('/', verifyTokenAuth, async (req, res) => {
  const newCart = new Cart(req.body)

  try {
    const savedCart = await newCart.save()

    res.status(201).json({ success: true, savedCart })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', verifyTokenAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )

    res.status(200).json(updatedCart)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', verifyTokenAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)

    res.status(200).json('Cart has been deleted')
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/find/:id', verifyTokenAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id })

    res.status(200).json(cart)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/', verifyTokenAdmin, async (req, res) => {
  try {
    const carts = await Cart.find()

    res.status(200).json(carts)
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
