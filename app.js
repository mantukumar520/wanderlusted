if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing");
const Review = require("./models/review");
const User = require("./models/user");
const wrapasync = require("./utils/wrapasync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

const listingsrouter = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userouter = require("./routes/user");

// ✅ Set DB URL from environment or fallback to local
const dbUrl = process.env.ATLASDB_URL;
console.log("Mongo URL:", dbUrl);


main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

// EJS + middleware setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ✅ Fix: Use correct `mongoUrl`, log if missing
if (!dbUrl) {
  console.error("❌ Missing MongoDB URL. Make sure ATLASDB_URL is set.");
  process.exit(1); // exit app if critical env variable is missing
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "thisshouldbeabettersecret",
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (err) {
  console.log("❌ Mongo Session Store Error:", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + CurrentUser middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;
  next();
});


// Routes
app.use("/", userouter);
app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewRoutes);

// Error Handler
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(status).render("error.ejs", { err });
});

// Port (Render will set PORT in env, use that)
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
console.log("Mongo URL:", process.env.ATLASDB_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("ATLASDB_URL:", process.env.ATLASDB_URL);

