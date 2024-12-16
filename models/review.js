const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating:{
        type:Number,
        min:0,
        max:5,
    },
    comment: String,
    createdAt:{
        type:Date,
        default: new Date()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
})

module.exports= new mongoose.model("Review",reviewSchema);
