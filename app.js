require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth.route') ; 
const preferenceRoutes = require('./routes/preferences.route');
const tokenMiddleware = require("./middlewares/auth.middleware");
const newsRoutes = require('./routes/news.route');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json("news aggregator service running")
}); 

app.use("/api/v1/auth", authRoutes);

app.use(tokenMiddleware);

app.use("/api/v1/preferences" , preferenceRoutes );
app.use("/api/v1/news" ,newsRoutes ) ; 

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