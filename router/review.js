const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");
const controllerRoute=require("../controller/reviews.js")

// Post review route
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,
  wrapAsync(controllerRoute.postReview)
);

// Delete review route
router.delete(
  "/:id/reviews/:reviewId",
  isReviewAuthor,
  wrapAsync(controllerRoute.destroyReview)
);

module.exports = router;
