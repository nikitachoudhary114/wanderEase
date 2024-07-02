const express = require("express");
const router = express.Router();
const user = require("../model/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = user({ email, username });
      await user.register(newUser, password);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
    async (req, res) => {
      req.flash("success","welcome back to wanderlust")
        res.redirect("/listings");
  }
);

module.exports = router;
