var express = require("express");
var router = express.Router();
const product_controller = require("../controllers/productController");

router.get("/", product_controller.index);

router.get("/add", product_controller.product_add_get);
router.post("/add", product_controller.product_add_post);

router.get("/:id", product_controller.product_details);

router.get("/:id/edit", product_controller.product_edit_get);
router.post("/:id/edit", product_controller.product_edit_post);

router.get("/:id/delete", product_controller.product_delete_get);
router.post("/:id/delete", product_controller.product_delete_post);

module.exports = router;
