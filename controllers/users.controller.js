const express = require("express");
const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    try {
        console.log("1. entered register");
        const { name = "", email = "", password = "", preferences = [] } = req.body;
        console.log("2. body received");
        // Validate data types
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Name, email and password must be strings"
            });
        }

        

        if (!Array.isArray(preferences) ) {
            return res.status(400).json({
                message: "preferences must be an array"
            });
        }


        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password;
        console.log("3. validation passed");
        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            return res.status(400).json("All fields are Needed");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }
        if (trimmedPassword.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }
        console.log("4. before findOne");

        const user = await User.findOne({ email: trimmedEmail });
        console.log("5. after findOne");

        if (user) {
            return res.status(400).json("user already exists with this email")
        }

        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        const newUser = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword,
            preferences
        });

        console.log("A user created sucessfully");
        return res.status(200).json("sucessfully registered a user");

    } catch (err) {
        console.error("Error in register function:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function login(req, res) {
    try {
        console.log("in login function ");
        const { email = "", password = "" } = req.body;
        if (typeof email !== "string" || typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "email and password must be strings"
            });
        }

        if (!email || !password) {
            return res.status(400).json("All fields are Needed");
        }
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password;
        if (!trimmedEmail || !trimmedPassword) {
            return res.status(400).json("All fields are Needed");
        }

        const user = await User.findOne({ email: trimmedEmail });

        if (!user) {
            return res.status(401).json("email or password are not correct");
        }
        const isPasswordCorrect = await bcrypt.compare(trimmedPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json("email or password are not correct");
        }

        const payload = {
            userId: user._id,
        };
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 24 * 60 * 60 });

        return res.status(200).json({
            "message": "login sucessful",
            "token": token
        });

    } catch (err) {
        console.log("error in login function ", err);
        return res.status(500).json({
        message: "Internal server error"
    });
    }
}


async function getPreferences(req, res) {
    try {
        console.log("inside of getpreferences");
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ "message": "user unauthenticated" });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(401).json({message:"user not foiund"});
        }
        const preferences = user.preferences;

        return res.status(200).json({
            "message": "Sucessfully fetched",
            preferences
        });
    } catch (err) {
        console.log("error ", err);
        return res.status(500).json({
        message: "Internal server error"
    });
    }

}


async function updatePreferences(req, res) {
    try {
        console.log("inside of updatePreferences");
        const userId = req.user.userId;
        const{ preferences} = req.body;
        
        if (!Array.isArray(preferences) ) {
            return res.status(400).json({
                message: "preferences must be an array"
            });
        }


        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        user.preferences =  preferences ;

        await user.save();
        return res.status(200).json({
            message: "Preferences updated successfully",
            preferences: user.preferences
        });


    } catch (err) {
       console.error("Error updating preferences:", err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }

}


module.exports = { login, register , getPreferences , updatePreferences }