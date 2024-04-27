const User = require("../models/userSchema");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// passport

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* Index - get */
exports.index = asyncHandler(async (req, res, next) => {
  redirect("/signup");
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
  failiureRedirect: "/login",
});
