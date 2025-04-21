const Listing = require("../models/listing.js");

module.exports.newRoute = (req, res) => {
  res.render("new.ejs");
};

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

module.exports.createRoute = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showRoute = async (req, res) => {
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
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};

module.exports.editRoute = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Cannot edit. Listing not found!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload/h_300,w_250");
  res.render("edit.ejs", { listing, originalImageUrl });
};

module.exports.updateRoute = async (req, res) => {
  const { id } = req.params;
  let url = req.file.path;
  let filename = req.file.filename;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  listing.image = { url, filename };
  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyRoute = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

module.exports.searchRoute = async (req, res) => {
  const location = req.query;
  const listing = await Listing.findOne(location);
  if (!listing) {
    return res.status(404).send("Listing not found");
  }
  res.redirect(`/listings/${listing._id}`);
};

module.exports.filterRoute = async (req, res) => {
  const { category } = req.query;
  const allListings = await Listing.find({ category });
  res.render("index.ejs", { allListings });
};
