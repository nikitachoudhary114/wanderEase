const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./model/listing");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }))

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust_web");
}


app.get("/", (req, res) => {
    res.send("Hi, i am root!");
});

//All listings
app.get("/listings", async (req, res) => {
    let listings = await Listing.find({});
    // console.log(listings);
    res.render("index.ejs", { listings });
})

//new  listing
app.get("/listings/new", (req, res) => {
    res.render("new.ejs");
})

//new listing data
app.post("/listings", async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);

    res.redirect("/listings");
})

//show listing
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("show.ejs", { listing });
})

//edit lisiting
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
});

//patch edit data
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log(listing);
    res.redirect(`/listings/${id}`);
})

//delete listing
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
})

app.listen(port, () => {
    console.log("listening to port ", port);
});
