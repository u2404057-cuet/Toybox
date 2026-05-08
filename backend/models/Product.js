const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock_qty:   { type: Number, default: 0, min: 0 },
  age_min:     { type: Number, default: 0 },
  age_max:     { type: Number, default: 99 },
  images:      { type: [String], default: [] },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text' })

module.exports = mongoose.model('Product', productSchema)
