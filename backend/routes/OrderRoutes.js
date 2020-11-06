const express = require('express')
const {placeOrder} = require('../Controllers/orderController')
const {protect, admin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').post(placeOrder)
module.exports = router
