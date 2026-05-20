const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.post('/create-payment-intent', authMiddleware, paymentController.createPaymentIntent);

router.post('/confirm-payment', authMiddleware, paymentController.confirmPayment);

router.post('/webhook',express.raw({type: 'application/json'}), paymentController.handleWebhook);

router.get('/payment-status/:paymentIntentId', authMiddleware, paymentController.getPaymentStatus);

module.exports = router;