const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email address!");
                }
            },
        },
        password: {
            type: String,
            required: true,
            min: 6,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Validate unique username
 */
UserSchema.path("username").validate(async (username) => {
    const countUsername = await mongoose.models.User.countDocuments({
        username,
    });
    return !countUsername;
}, "This username already exists!");

/**
 * Validate unique email
 */
UserSchema.path("email").validate(async (email) => {
    const countEmail = await mongoose.models.User.countDocuments({ email });
    return !countEmail;
}, "This email already exists!");

/**
 * Password hashing before saveing to the database
 * Algorithm: Bcrypt Hashing
 */
UserSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    user.password = await bcrypt.hash(user.password, 12);
    return next();
});

/**
 * Checking password
 */
UserSchema.methods.checkPassword = async function (password) {
    const user = this;
    const result = await bcrypt.compare(password, user.password);

    return result;
};

module.exports = mongoose.model("User", UserSchema);
