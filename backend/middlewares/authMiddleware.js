const { promisify } = require('util');
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User =  require('../models/UserModel.js')

exports.protect = asyncHandler(async (req, res, next) =>{
  let token = req.cookies.jwt || req.headers.jwt
  if(req.cookies.jwt || req.headers.jwt){
      let jwtToken = token
    try {
      const decoded = await promisify(jwt.verify)(
        jwtToken,
        process.env.JWT_SECRET
      );
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed!')
    }
  }

  if(!token){
    res.status(401)
    throw new Error('Not authorized, no token!')
  }

})

exports.admin = (req, res, next) =>{
  if(req.user && req.user.isAdmin){
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}
