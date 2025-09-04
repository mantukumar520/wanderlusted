
const Listing = require("./models/listing");
const Review = require("./models/review");
// module.exports.isLoggedIn = (req, res, next) => {
//      if (!req.isAuthenticated()) {
//         req.session.redirectUrl = req.originalUrl;  
//         req.flash("error", "you must be logged in to create listing!");
//         return res.redirect("/login");
//     }
//     next();
// }

// module.exports.saveRedirectUrl = (req, res, next) => {
//     if(req.session.redirectUrl) {
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next();
// };

// middleware.js



module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;  
    req.flash("error", "You must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req, res, next) => {
   const { id } = req.params;
      const listing = await Listing.findById(id);
      const currUser = res.locals.currentUser;
      if (!currUser || !listing.owner.equals(currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
      }
      next();
};

module.exports.isreviewAuthor = async(req, res, next) => {
      let { id, reviewId } = req.params;
      let review = await Review.findById(reviewId);
      const currUser = res.locals.currentUser;
      if (!currUser || !review.author.equals(currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
      }
      next();
};