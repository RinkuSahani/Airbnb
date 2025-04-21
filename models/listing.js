const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    set: (v) => (Array.isArray(v) ? v.join(", ") : v),
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  category: {
    type: String,
    enum: [
      "Beachfront",
      "Urban",
      "Mountain",
      "Historic",
      "Treehouse",
      "Lakefront",
      "Luxury",
      "Ski Resort",
      "Safari",
      "Island",
    ],
    required:true,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    let res = await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
