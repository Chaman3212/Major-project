const mongoose = require("mongoose");
const Schema =  mongoose.Schema;

const listingSchema =  Schema({
    title : {
        type: String,
        required : true
    },
    description : String,
    image: {
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s",
        set :(v)=>v===""?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPIfiGgUML8G3ZqsNLHfaCnZK3I5g4tJabQ&s" : v,
    },
    price:{
        type:Number,
        required:true
    },
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;