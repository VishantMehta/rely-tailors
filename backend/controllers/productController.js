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

//@desc    Fetch a single product by ID
//@route   GET /api/products/:id
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

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    // In a real app, this data comes from req.body sent by the admin form
    const product = new Product({
        name: 'Sample Product',
        description: 'Sample Description',
        basePrice: 0,
        category: 'Sample Category',
        imageUrl: '/images/sample.jpg',
        customizations: [],
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

//  @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, description, basePrice, category, imageUrl, customizations } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.basePrice = basePrice || product.basePrice;
        product.category = category || product.category;
        product.imageUrl = imageUrl || product.imageUrl;
        product.customizations = customizations || product.customizations;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404).json({ message: 'Product not found' });
    }
};


//@desc    Delete a product
//@route   DELETE /api/products/:id
//@access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};


/**
 * @desc    Create a new review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400).json({ message: 'Product already reviewed' });
            return;
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, };