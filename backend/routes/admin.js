const express            = require('express')
const router             = express.Router()
const multer             = require('multer')
const path               = require('path')
const { Product, Order, Category } = require('../models')
const auth               = require('../middleware/auth')
const admin              = require('../middleware/admin')

router.use(auth, admin)

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase()))
})

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const startOfDay = new Date(); startOfDay.setHours(0,0,0,0)
    const endOfDay   = new Date(); endOfDay.setHours(23,59,59,999)

    const orders_today  = await Order.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
    const revenueResult = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }])
    const total_revenue = revenueResult[0]?.total || 0
    const low_stock     = await Product.find({ stock_qty: { $gt: 0, $lt: 5 } }).sort({ stock_qty: 1 }).lean()
    const out_of_stock  = await Product.find({ stock_qty: 0 }).lean()

    res.json({ success: true, data: { orders_today, total_revenue, low_stock, out_of_stock } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const rawProducts = await Product.find().populate('category_id', 'name slug').sort({ createdAt: -1 }).lean()
    
    const mapProduct = (p) => ({
      ...p,
      id: p._id.toString(),
      category: p.category_id?.slug || 'all',
      image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
      ageRange: `${p.age_min}-${p.age_max}`,
      stock: p.stock_qty
    })

    const products = rawProducts.map(mapProduct)
    
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// POST /api/admin/products
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, category_id, stock_qty, age_min, age_max, images } = req.body
    if (!name || !price || !category_id)
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, price and category are required' } })

    const product = await Product.create({ name, description, price, category_id, stock_qty: stock_qty || 0, age_min, age_max, images: images || [] })
    res.status(201).json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
    if (!product) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } })
    res.json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } })
    res.json({ success: true, data: { message: 'Product deleted' } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query
    const filter = status && status !== 'All' ? { status } : {}
    const orders = await Order.find(filter).populate('user_id', 'name email').sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: orders })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses  = ['Pending', 'Processing', 'Shipped', 'Delivered']
    const statusOrder    = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3 }

    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid status value' } })

    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } })
    if (statusOrder[status] < statusOrder[order.status])
      return res.status(400).json({ success: false, error: { code: 'INVALID_STATUS', message: 'Cannot move order status backwards' } })

    order.status = status
    await order.save()
    res.json({ success: true, data: { id: order._id, status } })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// POST /api/admin/upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No image file provided' } })
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`
  res.json({ success: true, data: { url: imageUrl } })
})

module.exports = router
