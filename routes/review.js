const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../model/listing");
const Review = require("../model/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {  reviewSchema } = require("../schema");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Reviews
//new review post
router.post("/", validateReview, wrapAsync(async (req, res) => {
  
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success", "New review added");
    res.redirect(`/listings/${listing._id}`)
}));

//delete review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}))



module.exports = router