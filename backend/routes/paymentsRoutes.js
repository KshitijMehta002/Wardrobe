const express = require('express');
const { createdOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.get("/key", (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID || "rzp_test_TW2YAuv3Z22HYe" });
});
router.post("/order", createdOrder);
router.post("/verify", verifyPayment);

module.exports = router;
