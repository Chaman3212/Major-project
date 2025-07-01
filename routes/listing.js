const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const methodOverride = require("method-override");
const ExpressError = require("../utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const Listing = require("../models/listing.js");
const {listingSchema ,reviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const passport = require("passport");
const {logedIn} = require("../middleware.js")



//index route
router.get("/",async (req,res)=>{
    const allListings =await Listing.find({})
    res.render("listings/index.ejs",{ allListings });
})


//NEW ROUTE
router.get("/new", logedIn,(req, res) => {
    res.render("listings/new.ejs");
});
    




//CREATE ROUTE FOR NEW ROUTE
router.post("/",wrapAsync(async (req,res)=>{
    let reuslt = listingSchema.validate(req.body);
    if(reuslt.error){
        throw new ExpressError(404,reuslt.error)
    }
    const newListing= new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
    
}))

//EDIT ROUTE
router.get("/:id/edit",logedIn,async  (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

//UPDATE ROUTE
router.put("/:id",logedIn,async (req,res)=>{
   let {id}= req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   res.redirect(`/listings/${id}`);
   
})

//DELETE ROUTE
router.delete("/:id",async (req,res)=>{
    let {id}= req.params;
    let deletedListing =  await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    res.redirect("/listings")

})

//SHOW ROUTE
router.get("/:id",async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("reviews").populate('owner');
    res.render("listings/show.ejs",{listing})

})

module.exports= router;