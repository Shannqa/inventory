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
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    const result = await user.save();
    res.redirect("/");
  } catch (err) {
    return next(err);
  }

  res.render("signup_form", {
    title: "Sign Up",
    user: null,
  });
});

/* Login form - get */
exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login_form", {
    title: "Log In",
    user: null,
  });
});

/* Login form - post */
exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failiureRedirect: "/user/login",
});
