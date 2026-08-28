const express = require("express");
const User = require('../models/user.model');
const bcrypt = require("bcrypt");

async function register(req, res) {
    try {
        console.log("in register function ");
        const { name = "", email = "", password = "" } = req.body;
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            return res.status(400).json("All fields are Needed");
        }
        const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        console.log("hashed password is ", hashedPassword);

        const user = await User.findOne({ email: trimmedEmail });
        if (user) {
            return res.status(400).json("user already exists with this email")
        }

        const newUser = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword
        });

        console.log("A user created sucessfully");
        return res.status(201).json("sucessfully registered a user");

    } catch (err) {
        console.log("error in register function ", err)
    }
}

async function login(req, res) {
    try {
        console.log("in login function ");
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json("All fields are Needed");
        }
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if (!trimmedEmail || !trimmedPassword) {
            return res.status(400).json("All fields are Needed");
        }

        const user = await User.findOne({ email: trimmedEmail });
        if (!user) {
            return res.status(400).json("email or password are not correct");
        }
        const isPasswordCorrect = await bcrypt.compare( trimmedPassword , user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json("email or password are not correct");
        }

        return res.status(200).json({
            message: "login sucessful",
            user: {
                id: user._id,
                name: user.name
            }
        });

    } catch (err) {
        console.log("error in login function ", err)
    }
}

module.exports = { login, register }