// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: String,
//     image: {
//         filename: String,
//         url: String,
//         type: String,
//         default:
//              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF-toBT5RNpU414Kpvhl-kHqnVkk66RGHJarpq74H4DYkBfRdEJ9WKm3jZjeMhKG8Yle0&usqp=CAU",
//         set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF-toBT5RNpU414Kpvhl-kHqnVkk66RGHJarpq74H4DYkBfRdEJ9WKm3jZjeMhKG8Yle0&usqp=CAU" : v,
//     },
//     price: Number,
//     location: String,
//     country:String,
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: String,
  description: String,
  price:{
    type:Number,
    required: true,
  },

  image: {
    url: String,
    filename: String,
  },
  location: String,
  country: String,
  reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
