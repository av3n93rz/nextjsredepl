const express = require("express");
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware')
const { generateToken, processPayment } = require("../Controllers/braintreeController");

router.get("/getToken/", protect, generateToken);
router.post("/payment/", protect, processPayment);

module.exports = router;
