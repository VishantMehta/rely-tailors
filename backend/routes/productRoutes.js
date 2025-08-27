const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, } = require('../controllers/productController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

//admin only routes
router.route('/').post(protect, admin, createProduct);


router.route('/:id')
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

//review route 
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;