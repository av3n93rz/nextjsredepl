const express = require('express')
const {login, logout, signup, verify, sendToken} = require('../Controllers/authController')
const {getAllUsers,  getUserProfile, deleteUser, setFavorites} = require('../Controllers/userController')
const {protect, admin} = require('../middlewares/authMiddleware')


const router = express.Router()

router.post('/login', login)
router.post('/verify/:id', verify)
router.post('/sendToken/:id', sendToken)
router.post('/favorites/:id', setFavorites)
router.post('/signup', signup)
router.get('/logout', logout)
router.route('/admin').get(protect, admin, getAllUsers)
router.route('/admin/:id').get(protect, admin, getUserProfile)
router.route('/:id').delete(protect, admin, deleteUser)

module.exports = router