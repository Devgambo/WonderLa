const express = require("express");
const router = express.Router()
const listingController = require("../controllers/listings.js");
//things to require to make this work

const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../utils/middleware.js");

//for image uploads 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});       // multer will save the files in cloudinary storage



router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/:id/edit", 
    isLoggedIn,
    wrapAsync(listingController.renderEditForm)
);



//router.route("/xxx") this enables to bundle up all the calls with same paths
router.route("/")
    .get(wrapAsync(listingController.indexRoute))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,                                // passing this as middleware (to validate schema using joi)
        wrapAsync(listingController.addNew)      
    )
    
router.route("/:id")
    .get(wrapAsync(listingController.showRoute))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateEdit)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteRoute)
    )


module.exports = router;