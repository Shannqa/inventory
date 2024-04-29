var express = require("express");
var router = express.Router();
const user_controller = require("../controllers/userController");
const { isAuth, isAdmin } = require("../middleware/authorization");

/* Index */
router.get("/", user_controller.index);

/* Sign up form */
router.get("/signup", user_controller.signup_get);
router.post("/signup", user_controller.signup_post);

/* Log in form */
router.get("/login", user_controller.login_get);
router.post("/login", user_controller.login_post);

/* Log out */
router.get("/logout", user_controller.logout_get);

/* User account */
router.get("/account", isAuth, user_controller.account_get);

/* Admin panel */
router.get("/admin", isAdmin, user_controller.admin_get);

/* Unauthorized */
router.get("/unauthorized", user_controller.unauthorized_get);

module.exports = router;
