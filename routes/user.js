const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userContriller = require("../controllers/users.js");



router.route("/signup")
.get(userContriller.renderSignupform)
.post(
  wrapasync(userContriller.signup)
);

router.route("/login")
.get(userContriller.renderLoginform)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userContriller.login
);


router.get("/logout", userContriller.logout);

module.exports = router;
