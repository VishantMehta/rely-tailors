const path = require('path');
const express = require('express');
const multer = require('multer');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); //the folder where images will be saved
    },
    filename(req, file, cb) {
        //creating a unique filename: fieldname-timestamp.extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

//file type validation 
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

//initializing multer
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded Successfully',
        image: `/${req.file.path}`,
    });
});

module.exports = router;