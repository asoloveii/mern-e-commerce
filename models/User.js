const { model, Schema } = require('mongoose')

const User = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = model('User', User)
