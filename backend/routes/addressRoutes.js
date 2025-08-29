// backend/routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const { getAddresses, addAddress, deleteAddress } = require('../controllers/addressController.js');
const { protect } = require('../middleware/authMiddleware.js');

// All address routes are protected for the logged-in user
router.route('/')
    .get(protect, getAddresses)
    .post(protect, addAddress);

router.route('/:id').delete(protect, deleteAddress);

module.exports = router;