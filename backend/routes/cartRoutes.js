const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(protect, getCart).post(protect, addToCart);
router.route('/:cartItemId').delete(protect, removeFromCart);

module.exports = router;