const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");
const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//new listing data
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        let newListing = new Listing(req.body.listing);
        req.flash("success", "New listing created");
        await newListing.save();
        res.redirect("/listings");
    })
);

//show listing
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findById(id).populate("reviews");
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
    "/:id", validateListing,
    wrapAsync(async (req, res) => {

        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    })
);

//delete listing
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndDelete(id);
        req.flash("success", " Listing deleted");
        res.redirect("/listings");
    })
);

module.exports = router;