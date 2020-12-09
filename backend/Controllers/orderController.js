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
  paymentResult: req.body.paymentResult ? req.body.paymentResult:{status:'Not Paid'},
  paidAt: req.body.paidAt && req.body.paidAt
})
const createdOrder = await order.save()

res.status(201).json(createdOrder)
})

exports.getAllAdminOrders = asyncHandler (async (req, res) => {
  const orders = await Order.find().populate('user')
  res.json({orders})
})

exports.getUserOrders = asyncHandler (async (req, res) => {
  const pageSize = 5
  const page = Number(req.query.pageNumber) || 1
  const count = await Order.countDocuments({user:req.params.id})
  const orders = await Order.find({user:req.params.id}).limit(pageSize).skip(pageSize*(page-1)).select('-user')
  res.json({orders, page, pages: Math.ceil(count / pageSize)})
})

exports.setOrderStatus = asyncHandler (async (req, res) => {
  Order.updateOne({ _id: req.params.id }, { $set: { status: req.body.status } }, (err, order) => {
    if (err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
    res.json(order);
});
})

exports.setOrderArrayStatus = asyncHandler (async (req, res) => {
  const BreakException = 400;
  try {
    const updateItemStatus = async(item)=>{
      await Order.updateOne({ _id: item }, { $set: { status: req.body.status } }, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
      });
    }

    const processArray = async(array) =>{
      for(const item of array){
        await updateItemStatus(item)
      }
      res.json({})
    }
    processArray(req.body.array)

  } catch (e) {
    if (e !== BreakException) throw e;
  }
})

exports.getStatusValues = asyncHandler (async (req, res) => {
  res.json(Order.schema.path('status').enumValues);
})