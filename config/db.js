require("dotenv").config();

const mongoose = require("mongoose");

const dbConnection = mongoose.connect(process.env.MONGO_URI);

dbConnection
    .then(() => {
        console.log("Successfully connected to DB");
    })
    .catch((err) => {
        console.error("Error connecting to DB:", err);
    });

module.exports = dbConnection;