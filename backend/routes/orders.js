const express              = require('express')
const router               = express.Router()
const { Order, Product }   = require('../models')
const auth                 = require('../middleware/auth')

// POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    const { items, shipping_address, phone } = req.body
    if (!items?.length || !shipping_address || !phone)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Items, shipping address and phone are required' } })

    let total      = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product_id)
      if (!product)
        return res.status(400).json({ success: false, error: { code: 'PRODUCT_NOT_FOUND', message: `Product ${item.product_id} not found` } })
      if (product.stock_qty < item.quantity)
        return res.status(400).json({ success: false, error: { code: 'INSUFFICIENT_STOCK', message: `Not enough stock for ${product.name}` } })

      total += product.price * item.quantity
      orderItems.push({ product_id: product._id, name: product.name, quantity: item.quantity, unit_price: product.price })
      await Product.findByIdAndUpdate(product._id, { $inc: { stock_qty: -item.quantity } })
    }

    const order = await Order.create({
      user_id: req.user.id,
      items:   orderItems,
      total,
      shipping_address,
      phone,
    })

    res.status(201).json({ success: true, data: { order_id: order._id, total, status: order.status } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id }).sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: orders })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user_id: req.user.id }).lean()
    if (!order) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } })
    res.json({ success: true, data: order })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

module.exports = router
