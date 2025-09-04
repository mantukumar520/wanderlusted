const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review");
const Listing = require("../models/listing");
const { isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



const validateReview = (req, res, next) => {
   req.body.review.rating = Number(req.body.review.rating); 
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// reviews post route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapasync(reviewController.createReview));

  //review deelte route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isreviewAuthor,
  wrapasync(reviewController.deleteReview));

module.exports = router;
