const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const indexRouter = require("./routes");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
// const userRouter = require("./routes/user");
const PASS = require("./secret");
const app = express();
const User = require("./models/userSchema");
// mongoose setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = `mongodb+srv://shannqa:${PASS}@cluster0.wg6xdnw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
// app.use("/user", userRouter);

//passport
app.use(
  session({
    secret: "kitty",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* Index - get */
// app.get("/signup") = asyncHandler(async (req, res, next) => {
//   redirect("/");
// });

app.get("/", function (req, res, next) {
  res.render("index", { title: "Home", user: req.user || null });
});

/* Sign up form - get */
app.get("/signup", (req, res, next) => {
  res.render("signup_form", {
    title: "Sign Up",
    user: null,
  });
});

/* Sign up form - post */
app.post("/signup", async (req, res, next) => {
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
});

/* Login form - get */
app.get("/login", async (req, res, next) => {
  console.log(req.user);
  res.render("login_form", {
    title: "Log In",
    user: null,
  });
});

/* Login form - post */
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failiureRedirect: "/login",
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
