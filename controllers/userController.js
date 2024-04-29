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
    user: req.user || null,
  });
});

/* Sign up form - post */
exports.signup_post = [
  body("username", "Username must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must be at least 3 characters long.")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // there are errors
      res.render("signup_form", {
        title: "Sign Up",
        username: username,
        password: null,
        errors: errors.array(),
        user: req.user || null,
      });
      return;
    } else {
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
    }
  }),
];

/* Log in form - get */
exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login_form", {
    title: "Log In",
    user: req.user || null,
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

/* User account */
exports.account_get = asyncHandler(async (req, res, next) => {
  res.render("account", {
    title: "Your account",
    user: req.user || null,
  });
});

/* Admin panel */
exports.admin_get = asyncHandler(async (req, res, next) => {
  if (req.user.role === "admin") {
    res.render("admin", {
      title: "Admin panel",
      user: req.user || null,
    });
  } else {
    res.redirect("/unauthorized");
  }
});

/* Unauthorized page */
exports.unauthorized_get = asyncHandler(async (req, res, next) => {
  res.render("unauthorized", {
    title: "Access denied",
    user: req.user || null,
  });
});
