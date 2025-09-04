const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");

    res.redirect(`/listings/${listing._id}`);

    //console.log("new review saved");
    //res.send("new review saved");
  }
);

module.exports.deleteReview = (async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "review deleted!");
    res.redirect(`/listings/${id}`);
  }
);