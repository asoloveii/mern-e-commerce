const router = require('express').Router()
const Order = require('../models/Order')
const { verifyTokenAdmin, verifyTokenAuth } = require('./verifyToken')

router.post('/', verifyTokenAuth, async (req, res) => {
  const newOrder = new Order(req.body)

  try {
    const savedOrder = await newOrder.save()

    res.status(201).json({ success: true, savedOrder })
  } catch (e) {
    res.status(500).json(e)
  }
})

router.put('/:id', verifyTokenAuth, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )

    res.status(200).json(updatedOrder)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.delete('/:id', verifyTokenAuth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id)

    res.status(200).json('Order has been deleted')
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/find/:id', verifyTokenAuth, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.id })

    res.status(200).json(order)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/', verifyTokenAdmin, async (req, res) => {
  try {
    const orders = await Order.find()

    res.status(200).json(orders)
  } catch (e) {
    res.status(500).json(e)
  }
})

router.get('/income', verifyTokenAdmin, async (req, res) => {
  try {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: { month: { $month: "$createdAt" }, sales: '$amount' },
        $group: { _id: "$month", total: { $sum: "$sales" } }
      }
    ])

    res.status(200).json({ success: true, income })
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router
