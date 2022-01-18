const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const pinRouter = require("./routes/pin");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());

/**
 * Using routes
 */
app.use("/api/pins", pinRouter);
app.use("/api/users", userRouter);

const port = process.env.PORT || 3000;

// Connect to the database
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connect to the database successfully.");
    })
    .catch((err) => console.log(err));

app.listen(port, () => {
    console.log(`Backend server is running on port ${port}!`);
});
