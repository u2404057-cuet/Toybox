const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const connectDB = require('./db')
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth',       require('./routes/auth'))
app.use('/api/products',   require('./routes/products'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/cart',       require('./routes/cart'))
app.use('/api/profile',    require('./routes/profile'))
app.use('/api/orders',     require('./routes/orders'))
app.use('/api/admin',      require('./routes/admin'))

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: 'ToyBox API is running' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Something went wrong' }
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`ToyBox API running on http://localhost:${PORT}`))
