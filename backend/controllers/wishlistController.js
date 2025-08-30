const User = require('../models/User.js');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        // Check if the product is already in the wishlist
        const alreadyExists = user.wishlist.find(
            (item) => item.toString() === productId
        );
        if (alreadyExists) {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }

        user.wishlist.push(productId);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.status(201).json(updatedUser.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (user) {
        user.wishlist.pull(productId);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };