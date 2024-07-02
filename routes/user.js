const express = require("express");
const router = express.Router();
const user = require("../model/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveurl } = require("../middleware");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = user({ email, username });
      let registeredUser = await user.register(newUser, password);
      req.login(registeredUser, ((err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
      }))
      
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
  "/login",saveurl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
    async (req, res) => {
      req.flash("success", "welcome back to wanderlust")
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out");
    res.redirect("/listings");
  });
});

module.exports = router;
