const { ModifiedPathsSnapshot } = require("mongoose");
const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignup =  (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res)=>{
    try {
        let {username, password, email} = req.body;
        let newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wonderla");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.login = async (req,res)=>{
    req.flash("success", "Welcome to Wonderla, You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);   
        }
        req.flash("success","you are logged out");
        res.redirect("/listings")
    });
}