const express     = require('express')
const router      = express.Router()
const { Product } = require('../models')

// GET /api/products
router.get('/', async (req, res) => {
  try {
    let { category, search, sort, page = 1, limit = 20 } = req.query
    page  = parseInt(page)
    limit = parseInt(limit)

    const filter = {}
    if (search) filter.$text = { $search: search }

    if (category) {
      const { Category } = require('../models')
      const cat = await Category.findOne({ slug: category })
      if (cat) filter.category_id = cat._id
    }

    const sortOption =
      sort === 'price_asc'  ? { price: 1 }  :
      sort === 'price_desc' ? { price: -1 } :
      { createdAt: -1 }

    const total    = await Product.countDocuments(filter)
    const rawProducts = await Product.find(filter)
      .populate('category_id', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const mapProduct = (p) => {
      let imageUrl = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80';
      if (imageUrl.includes('http://127.0.0.1:5001')) {
        imageUrl = imageUrl.replace('http://127.0.0.1:5001', `${req.protocol}://${req.get('host')}`);
      }
      return {
        ...p,
        id: p._id.toString(),
        category: p.category_id?.slug || 'all',
        image: imageUrl,
        ageRange: `${p.age_min}-${p.age_max}`,
        stock: p.stock_qty
      };
    }

    const products = rawProducts.map(mapProduct)

    res.json({
      success: true,
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const rawProduct = await Product.findById(req.params.id).populate('category_id', 'name slug').lean()
    if (!rawProduct)
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } })
      
    const mapProduct = (p) => {
      let imageUrl = p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80';
      if (imageUrl.includes('http://127.0.0.1:5001')) {
        imageUrl = imageUrl.replace('http://127.0.0.1:5001', `${req.protocol}://${req.get('host')}`);
      }
      return {
        ...p,
        id: p._id.toString(),
        category: p.category_id?.slug || 'all',
        image: imageUrl,
        ageRange: `${p.age_min}-${p.age_max}`,
        stock: p.stock_qty
      };
    }

    res.json({ success: true, data: mapProduct(rawProduct) })
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } })
  }
})

module.exports = router
