const Product = require('../models/ProductModel')
const asyncHandler = require('express-async-handler')

exports.getAllProducts = asyncHandler (async (req, res) => {
  const pageSize = 18
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Product.countDocuments({...keyword})

  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize*(page-1))
  res.json({products, page, pages: Math.ceil(count / pageSize)})
})

exports.getSingleProduct = asyncHandler (async (req, res) => {
  const product = await Product.findById(req.params.id)
  if(product){
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
