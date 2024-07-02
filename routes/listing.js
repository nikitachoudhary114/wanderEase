const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");

const { isLoggedIn, isOwner, validateListing } = require("../middleware");



//All listings
router.get(
    "/",
    wrapAsync(async (req, res) => {
        let listings = await Listing.find({});
        // console.log(listings);
        res.render("listings/index.ejs", { listings });
    })
);

//new  listing
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//new listing data
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        let newListing = new Listing(req.body.listing);
        req.flash("success", "New listing created");
        newListing.owner = req.user._id;
        // console.log(req.user);
        await newListing.save();
        res.redirect("/listings");
    })
);

//show listing
router.get(
    "/:id",
    
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {path: "author"}
            })
            .populate("owner");
        if (!listing) {
            req.flash("error", "Listing does not exist!");
            res.redirect("/listings");
        }
       
        res.render("listings/show.ejs", { listing });
    })
);

//edit lisiting
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing does not exist!");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);

//patch edit data
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        
       await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    })
);

//delete listing
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        req.flash("success", " Listing deleted");
        res.redirect("/listings");
    })
);

module.exports = router;
