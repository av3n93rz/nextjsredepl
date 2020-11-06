const Order = require('../models/OrderModel')
const asyncHandler = require('express-async-handler')

exports.placeOrder = asyncHandler (async (req, res) => {
const order = new Order({
  user: req.body.user,
  orderItems: req.body.items,
  shippingAddress: req.body.address,
  paymentMethod: req.body.paymentMethod,
  itemsPrice: req.body.itemsPrice,
  shippingPrice: req.body.shippingPrice,
  shippingMethod: req.body.shippingMethod,
  totalPrice: req.body.totalPrice,
  paymentResult: req.body.paymentResult && req.body.paymentResult,
  paidAt: req.body.paidAt && req.body.paidAt
})
const createdOrder = await order.save()

res.status(201).json(createdOrder)
})