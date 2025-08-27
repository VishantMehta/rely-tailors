const User = require('../models/User.js');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password'); //exclude passwords from the result
    res.json(users);
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        //Add a check to prevent an admin from deleting their own account
        if (user.role === 'admin') {
            res.status(400).json({ message: 'Cannot delete an admin user' });
            return;
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

/**
 * @desc    Update a user's role
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


module.exports = { getUsers, deleteUser, updateUserRole };