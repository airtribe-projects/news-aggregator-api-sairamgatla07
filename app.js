require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db')
const router = require("express").Router();
const authRoutes = require('./routes/auth/auth.route')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200).json("news aggregator service running")
}); 


async function init() {
    try {
        const DB = await connectDB();
        app.listen(port, (err) => {
            console.log("Server running on ", port);
        });
    }
    catch (err) {
        console.log("Failed to initialize service ", err);
        process.exit(1);
    }
}

init();

module.exports = app;