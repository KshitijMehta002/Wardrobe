const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');
const { getProducts, createProduct, getProductsById, updateProduct, deleteProduct} = require('../controllers/productController')
const multer = require('multer');
const upload = multer({ dest : 'upload/'}); 

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route('/:id').get(getProductsById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;
