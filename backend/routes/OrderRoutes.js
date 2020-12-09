const express = require('express')
const {placeOrder, getAllAdminOrders, getUserOrders, getStatusValues, setOrderStatus, setOrderArrayStatus} = require('../Controllers/orderController')
const {protect, admin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').post(placeOrder)
router.route('/admin').get(protect, admin, getAllAdminOrders)
router.route('/admin/order/set-status/:id').post(protect, admin, setOrderStatus)
router.route('/admin/order/set-array-status').post(protect, admin, setOrderArrayStatus)
router.route('/admin/status-values').get(protect, admin, getStatusValues)
router.route('/by/user/:id').get(protect, admin, getUserOrders)
module.exports = router
