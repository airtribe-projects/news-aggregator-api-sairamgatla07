const express = require("express");
const router = require("express").Router();
const {register , login , getPreferences ,  updatePreferences } = require('../controllers/users.controller.js');
const tokenMiddleware = require("../middlewares/auth.middleware.js")

router.post('/signup', register);

router.post('/login',  login);

router.use(tokenMiddleware) ;

router.get("/preferences" , getPreferences);

router.put("/preferences", updatePreferences) ;


module.exports = router ;
