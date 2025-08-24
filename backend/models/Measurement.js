const mongoose = require('mongoose');
const measurementSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        profileName: {
            type: String,
            required: true,
            trim: true,
            default: 'My Measurements',
        },
        neck: { type: Number },
        chest: { type: Number },
        waist: { type: Number },
        hips: { type: Number },
        sleeveLength: { type: Number },
        shoulderWidth: { type: Number },
        shirtLength: { type: Number },
        trouserLength: { type: Number },
        inseam: { type: Number },
    },
    {
        timestamps: true,
    }
);
const Measurement = mongoose.model('Measurement', measurementSchema);

module.exports = Measurement;