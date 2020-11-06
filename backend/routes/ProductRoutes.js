const express = require('express')
const {getAllProducts, getSingleProduct, createProduct, getAdminProducts, deleteProduct} = require('../Controllers/productController')
const {protect, admin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').get(getAllProducts).post(protect, admin, createProduct)
router.route('/admin').get(protect, admin, getAdminProducts)
router.route('/:id').get(getSingleProduct).delete(protect, admin, deleteProduct)
module.exports = router
