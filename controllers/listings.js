const Listing = require("../models/listing.js");


module.exports.indexRoute = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{ allListings });
}

module.exports.renderNewForm =   (req,res)=>{
    res.render("listings/new.ejs");}

module.exports.addNew =  async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;    
    newListing.image = {url , filename};       
    await newListing.save();   
    req.flash("success","New Listing Created!");                                   
    res.redirect("/listings");                              
    }

module.exports.showRoute =  async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate :{
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you trying to reach does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm =  async (req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested doesnot exist");
        res.redirect("/listings");
    }

    // to make image at edit blury
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")


    res.render("listings/edit.ejs",{listing, originalImageUrl});
}

module.exports.updateEdit =  async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});


    if(req.file){           // agar new image file upload hui toh
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url , filename};
        listing.save();
    }

    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteRoute =  async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings");
}