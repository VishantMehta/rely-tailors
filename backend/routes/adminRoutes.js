const express = require('express');
const router = express.Router();

const { getAllOrders, updateOrderStatus } = require('../controllers/orderController.js');
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

//GET /api/admin/orders
router.route('/orders').get(protect, admin, getAllOrders);

// PUT /api/admin/orders/:id/status
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);

//user managements routes
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUserRole);


module.exports = router;