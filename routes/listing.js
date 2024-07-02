const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(validateListing, wrapAsync(listingController.addNewListingData));


router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//new  listing
router.get("/new", isLoggedIn, listingController.renderNewForm);


//edit lisiting
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);



module.exports = router;
