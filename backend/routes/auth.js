const express  = require('express')
const router   = express.Router()
const bcrypt   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const { User } = require('../models')

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, email and password are required' } })
    if (password.length < 6)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters' } })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(400).json({ success: false, error: { code: 'EMAIL_TAKEN', message: 'An account with this email already exists' } })

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({ name, email, password: hashed })
    const token  = signToken(user)

    const { password: _, ...safeUser } = user.toObject()
    res.status(201).json({ success: true, data: { user: safeUser, token } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' } })

    const user = await User.findOne({ email })
    if (!user || !user.password || !await bcrypt.compare(password, user.password))
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } })

    const token = signToken(user)
    const { password: _, ...safeUser } = user.toObject()
    res.json({ success: true, data: { user: safeUser, token } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body
    if (!googleId || !email)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'googleId and email are required' } })

    let user = await User.findOne({ email })

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId
        user.avatar   = avatar || user.avatar
        await user.save()
      }
    } else {
      user = await User.create({ name, email, googleId, avatar, password: null })
    }

    const token = signToken(user)
    const { password: _, ...safeUser } = user.toObject()
    res.json({ success: true, data: { user: safeUser, token } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

module.exports = router
