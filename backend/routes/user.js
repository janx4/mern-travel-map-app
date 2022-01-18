const router = require("express").Router();
const userController = require("../controllers/user");

// Register new user
router.post("/register", userController.register);

// Login user
router.post("/login", userController.login);

module.exports = router;
 