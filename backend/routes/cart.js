const express     = require('express')
const router      = express.Router()
const { Product } = require('../models')

// POST /api/cart/validate
router.post('/validate', async (req, res) => {
  try {
    const { items } = req.body
    if (!items || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Cart items are required' } })

    const issues   = []
    const validated = []

    for (const item of items) {
      const product = await Product.findById(item.product_id).lean()
      if (!product) { issues.push({ product_id: item.product_id, issue: 'Product no longer exists' }); continue }
      if (product.stock_qty === 0) { issues.push({ product_id: item.product_id, name: product.name, issue: 'Out of stock' }); continue }
      if (item.quantity > product.stock_qty) { issues.push({ product_id: item.product_id, name: product.name, issue: `Only ${product.stock_qty} left in stock`, available_qty: product.stock_qty }); continue }
      validated.push({ ...item, current_price: product.price, name: product.name })
    }

    res.json({ success: true, data: { valid: issues.length === 0, issues, validated } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

module.exports = router
