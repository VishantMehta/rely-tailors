const express = require('express');
const router = express.Router();
const {
    getMyMeasurements,
    addOrUpdateMeasurement,
} = require('../controllers/measurementController.js');
const { protect } = require('../middleware/authMiddleware.js'); // 👈 Import our guard!
router.route('/').get(protect, getMyMeasurements).post(protect, addOrUpdateMeasurement);

module.exports = router;