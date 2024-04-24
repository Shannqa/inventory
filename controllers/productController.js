const Product = require("../models/productSchema");
const Category = require("../models/categorySchema");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// list all authors
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });
});


/* List all products */
exports.products_list = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find().sort({ name : 1}).exec();
  
  res.render("products_list", {
    title: "All products",
    products_list: allProducts
  });
});

/* Show specific product details */

exports.product_details = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();
  
  if (product === null) {
    const err = new Error("Product not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_details", {
    title: "Product details",
    product: product
  });
})

/* Add a product - get */
exports.product_add = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name : 1}).exec();
  
  res.render("product_add", {
    title: "Add a product",
    product: null,
    categories_list: allCategories
  });
})

/* Add a product - post */

exports.book_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("author", "Author must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const [allAuthors, allGenres] = await Promise.all([
        Author.find().sort({ family_name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      // Mark our selected genres as checked.
      for (const genre of allGenres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = "true";
        }
      }
      res.render("book_form", {
        title: "Create Book",
        authors: allAuthors,
        genres: allGenres,
        book: book,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await book.save();
      res.redirect(book.url);
    }
  }),
];

/* Edit a product - get */

/* Edit a product - post */


/* Delete a product - get */

/* Delete a product - post */