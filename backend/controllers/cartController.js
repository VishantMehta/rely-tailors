const User = require('../models/User.js');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.cart);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
    const user = await User.findById(req.user._id);
    const newItem = req.body;

    if (user) {
        user.cart.push(newItem);
        await user.save();
        res.status(201).json(user.cart);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:cartItemId
 * @access  Private
 */
const removeFromCart = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        //use the .pull() method to remove an item from a document array in Mongoose
        user.cart.pull({ _id: req.params.cartItemId });
        await user.save();
        res.json(user.cart);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getCart, addToCart, removeFromCart };