const express = require('express')
const {createCategory, getCategories} = require('../Controllers/categoryController')
const {protect, admin} = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').get(getCategories).post(protect, admin, createCategory)
module.exports = router
