const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler')


exports.getAllUsers = asyncHandler (async (req, res) => {
  const users = await User.find().select('-password')
  res.json({users})
})

exports.getUserProfile = asyncHandler (async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if(user){
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

exports.deleteUser = asyncHandler (async (req, res) => {
  const user = await User.findById(req.params.id)
  if(user){
    await user.remove()
    res.json({
      message: 'User removed'
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

exports.setFavorites = asyncHandler (async (req, res) => {
    User.updateOne({ _id:req.params.id}, {[req.body.TOA ? '$addToSet':'$pull']:{favorites: req.body.itemId}}, (err, user) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
      res.json(user);
  } )
})