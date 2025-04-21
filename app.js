if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// ===== Imports =====
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ===== Custom utilities =====
const ExpressError = require("./utils/ExpressError.js");

// ===== Routers =====
const listingRoutes = require("./router/listing.js");
const reviewRoutes = require("./router/review.js");
const userRoutes = require("./router/user.js");

// ===== View Engine Setup =====
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===== Middleware =====
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode"));

// ===== MongoDB Connection =====
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(process.env.ATLASDB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Mongoose is connected to DataBase.");
  })
  .catch((err) => {
    console.log(err);
  });

// ===== Session Configuration =====
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ===== Passport Configuration =====
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===== Flash Middleware =====
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ===== Routes =====
app.use("/listings", listingRoutes);
app.use("/listings", reviewRoutes);
app.use("/", userRoutes);

// ===== Root Route =====
app.get("/", (req, res) => {
  console.dir(req.signedCookies);
  res.send("This is the root page.");
});

// ===== 404 Handler =====
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { err });
});

// ===== Server =====
app.listen(8080, () => {
  console.log("Server is working well.");
});
