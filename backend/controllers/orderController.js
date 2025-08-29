const Order = require('../models/Order.js');
const User = require('../models/User.js');
/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            totalPrice,
            //baki fields like orderStatus and paymentStatus have default values.
        });

        const createdOrder = await order.save();
        const user = await User.findById(req.user._id);
        if (user) {
            user.cart = [];
            await user.save();
        }
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

        if (order) {
            if (order.user._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


//for admin only :-

/**
 * @desc    Get all orders
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.orderStatus;

            if (req.body.orderStatus === 'Completed') {
                order.paymentStatus = 'Paid';
                order.paidAt = Date.now();
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

/**
 * @desc    Confirm an order
 * @route   PUT /api/admin/orders/:id/confirm
 * @access  Private/Admin
 */
const confirmOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.orderStatus === 'Pending Confirmation') {
            order.orderStatus = 'Confirmed';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(400).json({ message: 'Order has already been processed' });
        }
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

/**
 * @desc    Cancel an order
 * @route   PUT /api/admin/orders/:id/cancel
 * @access  Private/Admin
 */
const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = 'Cancelled';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

/**
 * @desc    Delete an order
 * @route   DELETE /api/admin/orders/:id
 * @access  Private/Admin
 */
const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        await order.deleteOne();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};


module.exports = {
    addOrderItems,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    confirmOrder,
    cancelOrder,
    deleteOrder,
};