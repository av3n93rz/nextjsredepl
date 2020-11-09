const express = require('express')
const {protect, admin} = require('../middlewares/authMiddleware')
const {deleteFromCDN} = require('../Controllers/imageKit')
const router = express.Router()

router.route('/:id').delete(protect, admin, deleteFromCDN)

module.exports = router