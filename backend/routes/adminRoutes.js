const express = require('express');
const router = express.Router();

const { getAllOrders, updateOrderStatus } = require('../controllers/orderController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

//GET /api/admin/orders
router.route('/orders').get(protect, admin, getAllOrders);

// PUT /api/admin/orders/:id/status
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);

module.exports = router;