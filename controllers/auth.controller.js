const express = require("express");
const User = require('../models/user.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    try {
        console.log("in register function ");
        const { name = "", email = "", password = "" } = req.body;
        // Validate data types
        if ( typeof name !== "string" || typeof email !== "string" || typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Name, email and password must be strings"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password ; 
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

        const user = await User.findOne({ email: trimmedEmail });
        if (user) {
            return res.status(400).json("user already exists with this email")
        }
        
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        const newUser = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword
        });

        console.log("A user created sucessfully");
        return res.status(201).json("sucessfully registered a user");

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
        const { email="", password="" } = req.body;
        if ( typeof email !== "string" || typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "email and password must be strings"
            });
        }

        if (!email || !password) {
            return res.status(400).json("All fields are Needed");
        }
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password ;
        if (!trimmedEmail || !trimmedPassword) {
            return res.status(400).json("All fields are Needed");
        }

        const user = await User.findOne({ email: trimmedEmail });
        
        if (!user) {
            return res.status(400).json("email or password are not correct");
        }
        const isPasswordCorrect = await bcrypt.compare(trimmedPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json("email or password are not correct");
        }

        const payload = {
            userId : user._id,
        };
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 24 * 60 * 60 });

        console.log("token is", token);
        return res.status(200).json({
            "message": "login sucessful",
            "token":token
        });

    } catch (err) {
        console.log("error in login function ", err)
    }
}

module.exports = { login, register }