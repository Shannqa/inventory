#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Product = require("./models/productSchema");
const Category = require("./models/categorySchema");

const products = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function productCreate(
  index,
  name,
  category,
  price,
  description,
  amount,
  image
) {
  const productdetail = {
    name: name,
    category: category,
    price: price,
    description: description,
    amount: amount,
  };
  if (image != false) productdetail.image = image;

  const product = new Product(productdetail);

  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Shoes"),
    categoryCreate(1, "Shirts"),
    categoryCreate(2, "Dresses"),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "Pink dress",
      categories[2],
      "50.99",
      "This is a dress. It's pink.",
      "10",
      false
    ),
    productCreate(
      1,
      "Crop top shirt",
      categories[1],
      "12.50",
      "Pretty shirt.",
      "8",
      false
    ),
    productCreate(
      2,
      "Black stilettos",
      categories[0],
      "31.25",
      "Shoes as sharp as steel.",
      "4",
      false
    ),
  ]);
}
