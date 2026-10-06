const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');
const { createOrder, getOrders, myorders, updateOrderStatus } = require('../controllers/OrderController')
const multer = require('multer');
const upload = multer({ dest : 'upload/'}); 

const router = express.Router();


router.route('/').get( protect, admin, getOrders).post(protect, createOrder);
router.route('/myorders').get( protect, myorders )
router.route('/:id/status').put(protect, admin, updateOrderStatus);


module.exports = router;
