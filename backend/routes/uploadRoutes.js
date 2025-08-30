const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'rely-tailors',
        allowed_formats: ['jpeg', 'png', 'jpg'],
    },
});

const upload = multer({ storage: storage });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.status(200).json({
        message: 'Image uploaded successfully',
        image: req.file.path,
    });
});

module.exports = router;