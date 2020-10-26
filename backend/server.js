const express = require('express')
const dotenv = require('dotenv')
const next = require('next')
const connectDB = require('./db.js')
const morgan = require('morgan')
const UserRoutes = require('./routes/UserRoutes')
const ProductRoutes = require('./routes/ProductRoutes')
const cookieParser = require('cookie-parser');
const path = require('path')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = process.env.PORT || 3000

connectDB()
dotenv.config()

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

  const __dirname = path.resolve()
  server.use('/images', express.static(path.join(__dirname, '/images')))

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