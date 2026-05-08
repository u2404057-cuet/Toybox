const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:        { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  unit_price:  { type: Number, required: true },
})

const orderSchema = new mongoose.Schema({
  user_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:            { type: [orderItemSchema], required: true },
  total:            { type: Number, required: true },
  status:           { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  shipping_address: { type: String, required: true },
  phone:            { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)
