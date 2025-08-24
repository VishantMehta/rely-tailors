const Product = require('../models/Product.js');

//@desc    Fetch all products
//@route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
  @desc    Fetch a single product by ID
  @route   GET /api/products/:id
 **/
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, getProductById };