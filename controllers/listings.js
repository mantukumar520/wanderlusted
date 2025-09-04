const Listing = require("../models/listing");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newroute = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "listing you requested for does not exist");
      return res.redirect("/listings");
    }
    console.log(listing);

    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing = (async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, " ..", filename);
    if (!req.body.listing) {
      throw new ExpressError(404, "send valid data for listing");
    }
    const { listing } = req.body;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  }
);

module.exports.editListing = (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "listing you requested for does not exist");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  }
);


module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Keep old image if new one is not provided
  if (
    !updatedData.image ||
    !updatedData.image.url ||
    updatedData.image.url.trim() === ""
  ) {
    updatedData.image = listing.image;
  }

  // Now update the listing
  listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });

  // If a new file is uploaded, update the image
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  return res.redirect(`/listings/${id}`);
};


module.exports.distroyListing = (async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
      return res.status(404).send("Listing not found");
    }
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
  }
);