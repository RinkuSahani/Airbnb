const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const controllerRoute = require("../controller/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const upload = multer({storage});


//  NEW route MUST come BEFORE any dynamic ":id" routes
router.get("/new", isLoggedIn, controllerRoute.newRoute);


//  INDEX route - show all listings & CREATE route - create new listing
router
  .route("")
  .get(wrapAsync(controllerRoute.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(controllerRoute.createRoute));

// Search route
  router.get("/search", wrapAsync(controllerRoute.searchRoute));

// Filter show
router.get("/filter",wrapAsync(controllerRoute.filterRoute));

//  EDIT FORM route
router.get("/:id/edit", wrapAsync(controllerRoute.editRoute));


// Show(for single listing) and update Route
router
  .route("/:id")
  .get(wrapAsync(controllerRoute.showRoute))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(controllerRoute.updateRoute));

  
//  DELETE route
router.delete("/:id/delete", wrapAsync(controllerRoute.destroyRoute));
// Search route

// Trending field
router.get("/listings/mountain",(req,res)=>{

}) 

module.exports = router;
