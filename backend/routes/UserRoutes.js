const express = require('express')
const {login, logout, signup, verify, sendToken} = require('../Controllers/authController')
const {getAllUsers} = require('../Controllers/userController')
const {protect, admin} = require('../middlewares/authMiddleware')


const router = express.Router()

router.post('/login', login)
router.post('/verify/:id', verify)
router.post('/sendToken/:id', sendToken)
router.post('/signup', signup)
router.get('/logout', logout)
router.route('/admin').get(protect, admin, getAllUsers)

module.exports = router