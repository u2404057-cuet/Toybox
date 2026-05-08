const express       = require('express')
const router        = express.Router()
const { Category }  = require('../models')

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean()
    res.json({ success: true, data: categories })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

module.exports = router
