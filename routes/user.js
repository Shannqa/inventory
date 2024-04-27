var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userController");

/* Index */
router.get("/", user_controller.index);

/* Sign up form */
router.get("/signup", user_controller.signup_get);
router.post("/signup", user_controller.signup_post);

/* Login form */
router.get("/login", user_controller.login_get);
router.post("/login", user_controller.login_post);

module.exports = router;
