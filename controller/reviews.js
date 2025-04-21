const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.postReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log(newReview.author);
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  }