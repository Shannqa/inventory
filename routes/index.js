const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home1", user: req.user || null });
});

module.exports = router;
