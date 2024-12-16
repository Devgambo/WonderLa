const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({     
    email: {            // this will auto set username and password by default with salting and hashing
        type:String,
        require:true,
    }                       
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User" , userSchema);
