const express = require('express')
const dotenv = require('dotenv')
const next = require('next')
const connectDB = require('./db.js')
const morgan = require('morgan')
const UserRoutes = require('./routes/UserRoutes')
const ProductRoutes = require('./routes/ProductRoutes')
const BrandRoutes = require('./routes/BrandRoutes')
const CategoryRoutes = require('./routes/CategoryRoutes')
const UploadRoutes = require('./routes/UploadRoutes')
const OrderRoutes = require('./routes/OrderRoutes')
const BraintreeRoutes = require('./routes/BraintreeRoutes');
const DeleteFromCDNRoutes = require('./routes/DeleteFromCDNRoutes');
const cookieParser = require('cookie-parser');
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = process.env.PORT || 3000

dotenv.config()
connectDB()

app.prepare()
.then(() => {
  const server = express()
  server.use(express.json())

  if(dev === true){
    server.use(morgan('dev'))
  }

  server.use(cookieParser());

  server.use('/api/v1/users', UserRoutes)
  server.use('/api/v1/products', ProductRoutes)
  server.use('/api/v1/categories', CategoryRoutes)
  server.use('/api/v1/brands', BrandRoutes)
  server.use('/api/v1/upload', UploadRoutes)
  server.use('/api/v1/deleteFromCDN', DeleteFromCDNRoutes)
  server.use('/api/v1/orders', OrderRoutes)
  server.use('/api/v1/braintree', BraintreeRoutes)


  const __dirname = path.resolve()
  server.use(express.static(path.join(__dirname, 'public')))

  server.get('*', (req, res) => {
    return handle(req, res)
  })
    
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`)
  })
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})