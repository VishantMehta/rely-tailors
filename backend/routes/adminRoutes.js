const express = require('express');
const router = express.Router();

const {
    getAllOrders,
    getOrderByIdAdmin,
    updateOrderStatus,
    confirmOrder,
    cancelOrder,
    deleteOrder
} = require('../controllers/orderController.js');

const {
    getUsers,
    deleteUser,
    updateUserRole
} = require('../controllers/userController.js');

const { protect, admin } = require('../middleware/authMiddleware.js');

// Orders routes
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/orders/:id').get(protect, admin, getOrderByIdAdmin); // admin view single order
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);
router.route('/orders/:id/confirm').put(protect, admin, confirmOrder);
router.route('/orders/:id/cancel').put(protect, admin, cancelOrder);
router.route('/orders/:id').delete(protect, admin, deleteOrder);

// User management
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUserRole);

module.exports = router;