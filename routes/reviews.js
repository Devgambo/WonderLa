const express = require("express");
const router = express.Router({mergeParams:true});          // we used mergeparams to use the id from parent route from app.js file

//all essential requires
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../utils/middleware.js")
const reviewController = require("../controllers/reviews.js");


//add review
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.addReview)
)
//delete reviews
router.delete("/:revid",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)

module.exports = router;