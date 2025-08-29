// backend/controllers/addressController.js
const User = require('../models/User.js');

/**
 * @desc    Get user's addresses
 * @route   GET /api/addresses
 * @access  Private
 */
const getAddresses = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Add a new address
 * @route   POST /api/addresses
 * @access  Private
 */
const addAddress = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses.push(req.body); // req.body should be a complete address object
        const updatedUser = await user.save();
        res.status(201).json(updatedUser.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Delete an address
 * @route   DELETE /api/addresses/:id
 * @access  Private
 */
const deleteAddress = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.addresses.pull({ _id: req.params.id }); // Remove the address sub-document by its _id
        const updatedUser = await user.save();
        res.json(updatedUser.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getAddresses, addAddress, deleteAddress };