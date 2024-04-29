var express = require("express");
var router = express.Router();
const product_controller = require("../controllers/productController");
const { isAdmin } = require("../middleware/authorization");

router.get("/", product_controller.index);

router.get("/add", isAdmin, product_controller.product_add_get);
router.post("/add", isAdmin, product_controller.product_add_post);

router.get("/edit", isAdmin, product_controller.products_edit_get);
router.post("/edit", isAdmin, product_controller.products_edit_post);

router.get("/delete", isAdmin, product_controller.products_delete_get);
router.post("/delete", isAdmin, product_controller.product_delete_post);

router.get("/:id", product_controller.product_details);

router.get("/:id/edit", isAdmin, product_controller.product_edit_get);
router.post("/:id/edit", isAdmin, product_controller.product_edit_post);

router.get("/:id/delete", isAdmin, product_controller.product_delete_get);
router.post("/:id/delete", isAdmin, product_controller.product_delete_post);

module.exports = router;
