// src/routes/payment.js
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  
  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise for INR)
    currency : 'INR',
    receipt: `receipt_${Date.now()}`
  };

  console.log("options : ",options);

  try {
    console.log("before");
    const order = await razorpay.orders.create(options);
    console.log("after");
    res.status(200).json(order);
  } catch (error) {
    console.log("error from razorPay : ",error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest === razorpay_signature) {
    res.status(200).json({ status: 'success', paymentId: razorpay_payment_id });
  } else {
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
});

module.exports = router;
