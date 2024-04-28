const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

/* Index - get */
exports.index = asyncHandler(async (req, res, next) => {
  res.redirect("/signup");
});

/* Sign up form - get */
exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render("signup_form", {
    title: "Sign Up",
    user: null,
  });
});

/* Sign up form - post */
exports.signup_post = asyncHandler(async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      next(err);
    } else {
      try {
        const user = new User({
          username: req.body.username,
          password: hash,
          role: "user",
        });
        const result = await user.save();
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    }
  });
});

/* Log in form - get */
exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login_form", {
    title: "Log In",
    user: null,
  });
});

/* Log in form - post */
exports.login_auth = passport.authenticate("local", {
  successRedirect: "/",
  failiureRedirect: "/",
});

exports.login_post = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-failure",
  })(req, res, next);
});

/* Log out */
exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
