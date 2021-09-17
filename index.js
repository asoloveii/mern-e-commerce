require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connection succefull'))
  .catch(e => console.log(e))

app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes.js'))
app.use('/api/users', require('./routes/users.routes.js'))
app.use('/api/products', require('./routes/products.routes.js'))
app.use('/api/carts', require('./routes/cart.routes.js'))
app.use('/api/orders', require('./routes/order.routes.js'))

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running')
})
