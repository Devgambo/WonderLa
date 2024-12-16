if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");

// for cokies
const session = require("express-session");
const MongoStore = require("connect-mongo")


const flash = require("connect-flash");

//passport requires
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//Express route include
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");


const dbUrl= process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,  
})

store.on("error",()=>{
    console.log("Error in mongo sesssion store", err)
})

const sessionOtions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now() + 1000*60*60*24*3,
        maxAge:  1000*60*60*24*3,
        httpOnly: true,
    },
}

app.use(session(sessionOtions));
app.use(flash());


//Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//  we use User.register("user1",password)


//Middleware for defining locals used in flash.
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// all routes related to listings , shifted to listing file in routes folder
app.use("/listings",listingsRouter);
// all routes related to review
app.use("/listings/:id/reviews", reviewsRouter);
//route for user (singin and login)
app.use("/",usersRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(500,"Page not found!!"))
})
app.use((err,req,res,next)=>{
    let { status =500,message="somethings off!!"} = err;
    res.status(status).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("listening to port 8080");
});

