const express = require("express");
const router = express.Router();
const User = require("../models/user")

const wrapAsync = require('../utils/wrapAsync.js');
const passport = require("passport");
const { saveUrl } = require("../utils/middleware.js");
const userController = require("../controllers/user.js");
const { route } = require("./listings.js");

//sign-up
router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup))

//log-in
router.route("/login")
    .get(userController.renderLogin)
    .post(
        saveUrl,                // therefore this middileware will save the value of session variable to local variable
        passport.authenticate("local",
             {failureRedirect:"/login" , failureFlash:true }),       //this middleware will delete the value stored in req.sessions.redirectUrl
        userController.login)

//log-out
router.get("/logout", userController.logout);


module.exports = router;