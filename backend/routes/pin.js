const router = require("express").Router();
const pinController = require("../controllers/pin");

// Add new pin
router.post("/", pinController.postNewPin);

// Get all pins
router.get('/', pinController.getAllPins);

module.exports = router;
