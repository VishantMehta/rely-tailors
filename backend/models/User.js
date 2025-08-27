const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const cartItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    measurements: { type: Object, required: false },
    selectedCustomizations: { type: Object, required: false },
});

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        cart: [cartItemSchema],

    },
    {
        timestamps: true,
    }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model('User', userSchema);

module.exports = User;