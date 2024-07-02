const Listing = require("../model/listing");

module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.addNewListingData = async (req, res) => {
    let newListing = new Listing(req.body.listing);
    req.flash("success", "New listing created");
    newListing.owner = req.user._id;
    // console.log(req.user);
    await newListing.save();
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", " Listing deleted");
    res.redirect("/listings");
}