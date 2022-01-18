const User = require("../models/User");

exports.register = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();

        const { username, email } = newUser;
        res.status(201).json({ username, email });
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json("Wrong credentials!");

        const isMatch = await user.checkPassword(req.body.password);
        !isMatch && res.status(400).json("Wrong credentials!");

        const { username } = user;
        res.json({ username, message: "Login successfully!" });
    } catch (err) {
        res.status(500).json();
    }
};
