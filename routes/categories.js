var express = require("express");
var router = express.Router();
const product_controller = require("../controllers/productController");
const category_controller = require("../controllers/categoryController");

router.get("/", category_controller.index);

router.get("/add", category_controller.category_add_get);
router.post("/add", category_controller.category_add_post);

router.get("/edit", category_controller.categories_edit_get);
router.post("/edit", category_controller.categories_edit_post);

router.get("/delete", category_controller.categories_delete_get);
router.post("/delete", category_controller.categories_delete_post);

router.get("/:id", category_controller.category_details);

router.get("/:id/edit", category_controller.category_edit_get);
router.post("/:id/edit", category_controller.category_edit_post);

router.get("/:id/delete", category_controller.category_delete_get);
router.post("/:id/delete", category_controller.category_delete_post);

module.exports = router;
