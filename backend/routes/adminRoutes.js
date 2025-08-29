const express = require('express');
const router = express.Router();

const { getAllOrders, updateOrderStatus, confirmOrder, cancelOrder, deleteOrder } = require('../controllers/orderController.js');
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

//GET /api/admin/orders
router.route('/orders').get(protect, admin, getAllOrders);

// PUT /api/admin/orders/:id/status
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);

//routes for order action
router.route('/orders/:id/confirm').put(protect, admin, confirmOrder);
router.route('/orders/:id/cancel').put(protect, admin, cancelOrder);
router.route('/orders/:id').delete(protect, admin, deleteOrder);

//user managements routes
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUserRole);


module.exports = router;