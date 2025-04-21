const express = require("express");
const router = express.Router();

const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const controllerRoute = require("../controller/users.js");

// SignUp credentials
router
.route("/signup")
.get(controllerRoute.signUpGet)
.post(controllerRoute.signUpPost);

// Login credentials
router
.route("/login")
.get(controllerRoute.getLogin)
.post(savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  controllerRoute.postLogin
);

// Logout credentials
router.get("/logout", controllerRoute.logout);

module.exports = router;
