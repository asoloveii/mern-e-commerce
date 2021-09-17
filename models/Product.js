const { model, Schema } = require('mongoose')

const Product = new Schema({
  title: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  category: { type: Array },
  size: { type: String },
  color: { type: String },
  price: { type: Number, required: true }
}, { timestamps: true })

module.exports = model('Product', Product)
