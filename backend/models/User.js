const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: null },
  phone:    { type: String, default: null },
  address:  { type: String, default: null },
  is_admin: { type: Boolean, default: false },
  googleId: { type: String, default: null },
  avatar:   { type: String, default: null },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
