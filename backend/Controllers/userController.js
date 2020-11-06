const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')


exports.getAllUsers = asyncHandler (async (req, res) => {
  const users = await User.find().select('-password')
  res.json({users})
})