const Brand = require('../models/BrandModel')
const asyncHandler = require('express-async-handler')

exports.createBrand = asyncHandler (async (req, res) => {
  const brand = new Brand({
    name: req.body.name
  })

  const createdBrand = await brand.save()

  res.status(201).json(createdBrand)
})

exports.getBrands = asyncHandler (async (req, res) => {
  const brands = await Brand.find()
  res.json(brands)
})