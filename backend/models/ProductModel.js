const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const Brand = require('./BrandModel')
const Category = require('./CategoryModel')
const User = require('./UserModel')

const reviewSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },
  comment:{
    type: String,
    required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:User
  },
}, {timestamps: true})

const productSchema = new mongoose.Schema({
  user:{
    type: ObjectId,
    required:true,
    ref:User
  },
  name: {
    type: String,
    required:true
  },
  image: {
    type: Array,
    required:true
  },
  brand: {
    type: ObjectId,
    ref: Brand,
    trim: true,
    required: true
  },
  category:{
    type: ObjectId,
    ref: Category,
    trim: true,
    required: true
  },
  description: {
    type: String,
    required:true,
  },
  reviews:[
    reviewSchema
  ],
  rating: {
    type: Number,
    required:true,
    default: 0
  },
  numReviews: {
    type: Number,
    required:true,
    default: 0
  },
  price: {
    type: Number,
    required:true,
    default: 0
  },
  countInStock: {
    type: Number,
    required:true,
    default: 0
  }
}, {
  timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
