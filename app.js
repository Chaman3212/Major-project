const express = require("express");
const app = express()
const mongoose = require("mongoose");
const Listing = require("../Major_project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js")
const Review = require("../Major_project/models/reviews.js");
const {reviewSchema} = require("./schema.js");
const reviews = require("../Major_project/models/reviews.js");
//Database connection
main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //for parsing the data
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//test listing
// app.get("/",(req,res)=>{
//     res.send("app is working properly")
// })

// app.get("/test/listing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description : "By the beach",
//         price : 1200,
//         location: "Goa",
//         country: "India"
//     });
//     await sampleListing.save()
//     console.log("saved successfuly ");
//     res.send("done");


// });

//validation
const validateReview = (req,res,next) =>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,errMsg);
    }else{
        next();
    }
}



//index route
app.get("/listing",async (req,res)=>{
    const allListings =await Listing.find({})
    res.render("listings/index.ejs",{ allListings });
})


//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
    
})

//CREATE ROUTE FOR NEW ROUTE
app.post("/listings",wrapAsync(async (req,res)=>{
    let reuslt = listingSchema.validate(req.body);
    console.log(reuslt);
    if(reuslt.error){
        throw new ExpressError(404,reuslt.error)
    }
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
    
}))

//EDIT ROUTE
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

//UPDATE ROUTE
app.put("/listings/:id",async (req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   res.redirect(`/listings/${id}`);
   
})

//DELETE ROUTE
app.delete("/listings/:id/",async (req,res)=>{
    let {id}= req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listing")

})

//SHOW ROUTE
app.get("/listings/:id",async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing,reviews})

})

//REVIEW ROUTE
app.post("/listings/:id/review",validateReview,wrapAsync( async (req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`)

}));
//DELETE REVIEWS
app.delete("/listings/:id/review/:reviewId",wrapAsync(async (req,res)=>{
 let { id,reviewId }= req.params;
 await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
 await Review.findByIdAndDelete(reviewId);
 res.redirect(`/listings/${id}`)

}))


app.use((err,req,res,next)=>{
    let{status,message}= err;
   res.render("error.ejs",{err})
})


app.listen(4000,()=>{
    console.log("app is listing on port 3000")
});

