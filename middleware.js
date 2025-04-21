const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
      if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in,first.");
        return res.redirect("/login");
      };
      next();
};

module.exports.savedRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner= async (req,res,next)=>{
  const { id } = req.params;
   let listing = await Listing.findById(id); 
     if (!listing.owner[0]._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You dont't have permission to edit.");
        return res.redirect(`/listings/${id}`);
      }
      next();
}
module.exports.isReviewAuthor= async (req,res,next)=>{
  const { id,reviewId } = req.params;
   let review = await Review.findById(reviewId);
     if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
      }
      next();
}

// Validation middleware for listings
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    return res.status(400).send(msg);
  } else {
    next();
  }
};

