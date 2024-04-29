var express = require("express");
var router = express.Router();
const product_controller = require("../controllers/productController");
const category_controller = require("../controllers/categoryController");
const { isAdmin } = require("../middleware/authorization");

router.get("/", category_controller.index);

router.get("/add", isAdmin, category_controller.category_add_get);
router.post("/add", isAdmin, category_controller.category_add_post);

router.get("/edit", isAdmin, category_controller.categories_edit_get);
router.post("/edit", isAdmin, category_controller.categories_edit_post);

router.get("/delete", isAdmin, category_controller.categories_delete_get);
router.post("/delete", isAdmin, category_controller.categories_delete_post);

router.get("/:id", category_controller.category_details);

router.get("/:id/edit", isAdmin, category_controller.category_edit_get);
router.post("/:id/edit", isAdmin, category_controller.category_edit_post);

router.get("/:id/delete", isAdmin, category_controller.category_delete_get);
router.post("/:id/delete", isAdmin, category_controller.category_delete_post);

module.exports = router;
