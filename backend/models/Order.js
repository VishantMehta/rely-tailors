const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [
            {
                name: { type: String, required: true },
                imageUrl: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
                measurements: { type: Object, required: false },
                selectedCustomizations: { type: Object, required: false }, // e.g., { "Fabric": "Linen" }
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            addressLine1: { type: String, required: true },
            addressLine2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true, default: 'India' },
            phoneNumber: { type: String, required: true },
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        orderStatus: {
            type: String,
            required: true,
            enum: [
                'Pending Confirmation',
                'Confirmed',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled',
            ],
            default: 'Pending Confirmation',
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'Pay at Store',
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid'],
            required: true,
            default: 'Pending',
        },
        paidAt: {
            type: Date,
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;