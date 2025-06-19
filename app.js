const express = require("express");
const app = express()
const mongoose = require("mongoose");
const Listing = require("../Major_project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")

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
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing")

})

//SHOW ROUTE
app.get("/listings/:id",async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing})

})



app.use((err,req,res,next)=>{
    let{status,message}= err;
    res.status(status).send(message);
})


app.listen(4000,()=>{
    console.log("app is listing on port 3000")
});