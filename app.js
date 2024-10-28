const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema} = require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust"

main().then(() => {
    console.log("connected to DB")
})
.catch(err => {
    console.log(err);
});
async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("Hii i'm root");
});

//Index Route
app.get("/listings", async(req,res) => {
    const allListings = await Listing.find({})
       res.render("listings/index.ejs", {allListings});
});

 //new Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs")
});

//Read: show route
app.get("/listings/:id", async(req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//create Route
app.post("/listings",
    wrapAsync(async (req, res, next) => {
        console.log(req.body);
        let result = listingSchema.validate(req.body);
        console.log(result);
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
})
);

 //Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update

app.put("/listings/:id", wrapAsync(async(req,res) => {
    let { id } = req.params;
    if(!req.body.listing) {
        throw new ExpressError(400, "Some valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));


app.all("*", (req,res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode= 500, message="Something went wrong"} = err;
   // res.status(statusCode).send(message);
   res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

