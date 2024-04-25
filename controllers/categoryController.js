const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

/* List all categories */
exports.index = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render("categories_list", {
    title: "All categories",
    categories_list: allCategories,
  });
});

/* Show specific category and its products */

exports.category_details = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_details", {
    title: "Category details",
    category: category,
    products: products,
  });
});

/* Add a category - get */
exports.category_add_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Add a category",
    category: null,
    errors: null,
  });
});

/* Add a category - post */
exports.category_add_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Add a category",
        errors: errors.array(),
      });
    } else {
      // Data from is valid. Save category.
      await category.save();
      res.redirect(category.url);
    }
  }),
];

/* Edit a category - get */
exports.category_edit_get = asyncHandler(async (req, res, next) => {
  // Get category and all products in category.
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (category === null) {
    res.redirect("/categories");
  }

  res.render("category_form", {
    title: "Edit category",
    category: category,
    products: products,
    errors: null,
  });
});

/* Edit a category - post */
exports.category_edit_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all products.
      const products = await Product.find({ category: req.params.id })
        .sort({ name: 1 })
        .exec();

      res.render("category_form", {
        title: "Edit category",
        category: category,
        products: products,
        errors: errors.array(),
      });

      return;
    } else {
      // Data from form is valid. Update category.
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];

/* Delete a category - get */
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get category and all products in category.
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (category === null) {
    res.redirect("/categories");
  }

  res.render("category_delete", {
    title: "Delete category",
    category: category,
    products: products,
    errors: null,
  });
});

/* Delete a product - post */
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (products.length > 0) {
    res.render("category_delete", {
      title: "Delete category",
      category: category,
      products: products,
      errors: null,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/categories");
  }
});
