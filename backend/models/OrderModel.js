const mongoose = require('mongoose')
const User = require('./UserModel')
const Product = require('./ProductModel')

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref: User
  },
  orderItems: [
    {
      name: {type: String, required: true},
      count: {type: Number, required: true},
      image: {type: String, required: true},
      price: {type: Number, required: true},
      id: {type: mongoose.Schema.Types.ObjectId, required: true, ref: Product},
    }
  ],
  shippingAddress: {
    country:{type: String, required: true},
    fullName:{type: String, required: true},
    phoneNum:{type: String, required: true},
    zipCode:{type: String, required: true},
    addressLine1:{type: String, required: true},
    addressLine2:{type: String},
    city:{type: String, required: true},
    county:{type: String},
    comment:{type: String},
  },
  paymentMethod: {
    type: String,
    required:true,
  },
  paymentResult: {
    transaction_id:{type:String},
    status:{type:String},
    update_time:{type:String},
    email_address:{type:String},
    amount:{type:String},
  },
  itemsPrice: {
    type: Number,
    required:true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required:true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required:true,
    default: 0.0
  },
  shippingMethod: {
    type: String,
    required:true
  },
  totalPrice: {
    type: Number,
    required:true,
    default: 0.0
  },
  paidAt: {
    type: String
  },
  isDelivered: {
    type: Boolean,
    required:true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
}, {
  timestamps: true
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order