const mongoose = require('mongoose');

const customizationOptionSchema = mongoose.Schema({
    optionName: { type: String, required: true },
    additionalPrice: { type: Number, required: true, default: 0 },
    imageUrl: { type: String },
});
const customizationSchema = mongoose.Schema({
    name: { type: String, required: true },
    options: [customizationOptionSchema],
});
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        basePrice: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        customizations: [customizationSchema],
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;