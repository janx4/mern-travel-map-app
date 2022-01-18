const Pin = require("../models/Pin");

// Add new Pin
exports.postNewPin = async (req, res) => {
    const newPin = new Pin(req.body);
    try {
        const savedPin = await newPin.save();
        res.status(201).json(savedPin);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get all pins
exports.getAllPins = async (req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json(pins);
    } catch (err) {
        res.status(500).json(err);
    }
}