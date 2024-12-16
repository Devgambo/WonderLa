module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;                  // we are creating a variable redirectUrl to store the path user was trying to go.
        req.flash("error","you must be logged in");
        res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


const Listing = require("../models/listing");

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","You don't have permission");
            return res.redirect(`/listings/${id}`);
        }
        next();
}


const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");

// joi function to validate server side
module.exports.validateListing= (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);        // Joi is working 
    if(error){
        let errMsg =  error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const { reviewSchema} = require("../schema.js");

//validation for reviews using joi
module.exports.validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg =  error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


const Review = require("../models/review.js");
module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,revid} = req.params;
        let review = await Review.findById(revid);
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","You are'nt the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
}