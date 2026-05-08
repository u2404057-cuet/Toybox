const express  = require('express')
const router   = express.Router()
const { User } = require('../models')
const auth     = require('../middleware/auth')

// GET /api/profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').lean()
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// PUT /api/profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body
    if (!name) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name is required' } })

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone: phone || null, address: address || null },
      { new: true }
    ).select('-password').lean()

    res.json({ success: true, data: user })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

module.exports = router
