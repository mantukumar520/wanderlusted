const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
//const { isLoggedIn} = require("../middleware.js");
const { isLoggedIn, saveRedirectUrl, isOwner } = require("../middleware");
const listingController = require("../controllers/listings.js"); 

const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// Index Route
router
.route("/")
.get(wrapasync(listingController.index))
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapasync(listingController.createListing)
);
// .post(,(req, res) => {
//   res.send(req.file);
// });

router.get("/new", isLoggedIn, listingController.newroute);

router.route("/:id")
.get(wrapasync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapasync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapasync(listingController.distroyListing)
);



// New Route


// Show Route


// Create Route

// Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapasync(listingController.editListing));

// Update Route

// Delete Route

module.exports = router;

