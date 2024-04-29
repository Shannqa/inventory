const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

/* List all products */
exports.index = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find().sort({ name: 1 }).exec();

  res.render("products_list", {
    title: "All products",
    products_list: allProducts,
    user: req.user || null,
  });
});

/* Show specific product details */

exports.product_details = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_details", {
    title: "Product details",
    product: product,
    user: req.user || null,
  });
});

/* Add a product - get */
exports.product_add_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render("product_form", {
    title: "Add a product",
    product: null,
    categories_list: allCategories,
    user: req.user || null,
  });
});

/* Add a product - post */
exports.product_add_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty. Format: 00.00, no currency.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("amount", "Amount must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("product_form", {
        title: "Add a product",
        product: product,
        categories_list: allCategories,
        errors: errors.array(),
        user: req.user || null,
      });
    } else {
      // Data from form is valid. Save book.
      await product.save();
      res.redirect(product.url);
    }
  }),
];

/* Edit a product - get */
exports.product_edit_get = asyncHandler(async (req, res, next) => {
  // Get product and all categories for form.
  const [product, allCategories] = await Promise.all([
    Product.findById(req.params.id).populate("category").exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (product === null) {
    const err = new Error("Product not found.");
    err.status = 404;
    return next(err);
  }

  res.render("product_form", {
    title: "Edit product",
    categories: allCategories,
    product: product,
    errors: null,
    user: req.user || null,
  });
});

/* Edit a product - post */
exports.product_edit_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("price", "Price must not be empty. Format: 00.00, no currency.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("amount", "Amount must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Product object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      amount: req.body.amount,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("product_form", {
        title: "Edit product",
        categories: allCategories,
        product: product,
        errors: errors.array(),
        user: req.user || null,
      });

      return;
    } else {
      // Data from form is valid. Update product.
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        product,
        {}
      );
      res.redirect(updatedProduct.url);
    }
  }),
];

/* Delete a product - get */
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

  if (product === null) {
    res.redirect("/products");
  }

  res.render("product_delete", {
    title: "Delete produxt",
    product: product,
    user: req.user || null,
  });
});

/* Delete a product - post */
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category")
    .exec();

  await Product.findByIdAndDelete(req.body.productid);

  res.redirect("/products");
});

exports.products_edit_get = function () {};
exports.products_edit_post = function () {};

exports.products_delete_get = function () {};
exports.products_delete_post = function () {};
