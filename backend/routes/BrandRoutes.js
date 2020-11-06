const express = require('express')
const {createBrand, getBrands} = require('../Controllers/brandController')
const {protect, admin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').get(getBrands).post(protect, admin, createBrand)
module.exports = router
