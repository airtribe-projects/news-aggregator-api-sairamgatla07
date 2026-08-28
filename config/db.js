require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
    try {
        const Db = await mongoose.connect(MONGO_URI);
        console.log("sucessfully connected to DB");

    }
    catch (err) {
        console.log("error in connecting to DB ", err);
    }
}

module.exports = connectDB;