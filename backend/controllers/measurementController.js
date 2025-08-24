const Measurement = require('../models/Measurement.js');

/**
 * @desc    Get logged-in user's measurements
 * @route   GET /api/measurements
 * @access  Private
 */
const getMyMeasurements = async (req, res) => {
    try {
        const measurements = await Measurement.find({ user: req.user._id });
        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Add or update a measurement profile
 * @route   POST /api/measurements
 * @access  Private
 */
const addOrUpdateMeasurement = async (req, res) => {
    const { profileName, neck, chest, waist, hips, sleeveLength, shoulderWidth, shirtLength, trouserLength, inseam } = req.body;
    try {
        let measurement = await Measurement.findOne({ user: req.user._id });

        if (measurement) {
            measurement.profileName = profileName || measurement.profileName;
            measurement.neck = neck || measurement.neck;
            measurement.chest = chest || measurement.chest;
            const updatedMeasurement = await measurement.save();
            res.json(updatedMeasurement);
        }
        else {
            const newMeasurement = new Measurement({
                user: req.user._id,
                profileName,
                neck,
                chest,
            });

            const createdMeasurement = await newMeasurement.save();
            res.status(201).json(createdMeasurement);
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMyMeasurements, addOrUpdateMeasurement };