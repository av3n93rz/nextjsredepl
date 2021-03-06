const Product = require('../models/ProductModel')
const asyncHandler = require('express-async-handler')


exports.getAllProducts = asyncHandler (async (req, res) => {
  let sortField = 'name'
  let sortOrder = 'asc'
  let sortTag = 'name-asc'
  if(req.query.sortBy !== 'undefined'){
    const sortBy = req.query.sortBy.split('-')
    sortField = sortBy[0]
    sortOrder = sortBy[1]
    sortTag = req.query.sortBy
  }
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Product.countDocuments({...keyword})

  Product.find({...keyword}).collation({locale: "en" }).sort([[sortField, sortOrder]]).limit(pageSize).skip(pageSize*(page-1)).exec((err, products) => {
    if (err) {
        return res.status(400).json({
            error: 'Products not found'
        });
    }
    res.json({products, sortTag, page, pages: Math.ceil(count / pageSize)})
});
  
})

exports.getAdminProducts = asyncHandler (async (req, res) => {
  const products = await Product.find().populate('brand category').select('-user -image -numReviews -description -reviews')
  res.json({products})
})

exports.getSingleProduct = asyncHandler (async (req, res) => {
  const product = await Product.findById(req.params.id).populate('brand category').select('-user')
  if(product){
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

exports.createProduct = asyncHandler (async (req, res) => {
    const sample = ['/images/sample.jpg']
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    user: req.user._id,
    image: req.body.images ? req.body.images:sample,
    brand: req.body.brand === 'Add New Brand' ? req.body.newBrandId:req.body.brand,
    category: req.body.category === 'Add New Category' ? req.body.newCategoryId:req.body.category,
    countInStock: req.body.countInStock,
    numReviews: 0,
    description: req.body.description
  })

  const createdProduct = await product.save()

  res.status(201).json(createdProduct)
})

exports.updateProduct = asyncHandler (async (req, res) => {
  const sample = ['/images/sample.jpg']
  const product = await Product.findById(req.params.id)
  if(product){
    product.name = req.body.name,
    product.price = req.body.price,
    product.image = req.body.images ? [...req.body.image, ...req.body.images]:req.body.image,
    product.brand = req.body.brand === 'Add New Brand' ? req.body.newBrandId:req.body.brand,
    product.category = req.body.category === 'Add New Category' ? req.body.newCategoryId:req.body.category,
    product.countInStock = req.body.countInStock,
    product.description = req.body.description
    product.discount = req.body.discount ? true:false,
    product.discountPrice = req.body.discount ? req.body.discountPrice: 0

    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
  
})
exports.createProduct = asyncHandler (async (req, res) => {
    const sample = ['/images/sample.jpg']
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    user: req.user._id,
    image: req.body.images ? req.body.images:sample,
    brand: req.body.brand === 'Add New Brand' ? req.body.newBrandId:req.body.brand,
    category: req.body.category === 'Add New Category' ? req.body.newCategoryId:req.body.category,
    countInStock: req.body.countInStock,
    numReviews: 0,
    description: req.body.description,
    discount: req.body.discount ? true:false,
    discountPrice: req.body.discount ? req.body.discountPrice: 0
  })

  const createdProduct = await product.save()

  res.status(201).json(createdProduct)
})

exports.deleteProduct = asyncHandler (async (req, res) => {
  const product = await Product.findById(req.params.id)
  if(product){
    await product.remove()
    res.json({
      message: 'Product removed'
    })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
