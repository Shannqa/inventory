const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  image: { type: String },
  
});

ProductSchema.virtual("url").get(function () {
  // dont use arrow function because this obj is needed
  return `/products/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);
