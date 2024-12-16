const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required:true,
    },
    description: String,
    // image:{
    //     default:"https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     type:String,
    //     set: (v)=> v===""? "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    // },
    image:{
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref:"Review",
        },
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
});

//An mongoose middleware to handle deletes
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews} });
    }
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
