const Category = require('../models/CategoryModel')
const asyncHandler = require('express-async-handler')

exports.createCategory = asyncHandler (async (req, res) => {
  const category = new Category({
    name: req.body.name
  })

  const createdCategory = await category.save()

  res.status(201).json(createdCategory)
})

exports.getCategories = asyncHandler (async (req, res) => {
  const categories = await Category.find()
  res.json(categories)
})