require("dotenv").config();

const express = require("express");

const app = express();

const dbConnection = require("./config/db");

const authRoutes = require("./routes/users.route");
const tokenMiddleware = require("./middlewares/auth.middleware");
const newsRoutes = require("./routes/news.route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json("news aggregator service running");
});

// Wait for MongoDB before processing requests
app.use(async (req, res, next) => {
    try {
        await dbConnection;
        next();
    } catch (err) {
        console.error("Database connection failed:", err);

        return res.status(500).json({
            message: "Database connection failed"
        });
    }
});

app.use("/users", authRoutes);

app.use(tokenMiddleware);

app.use("/news", newsRoutes);

module.exports = app;