// Quản lý loại món ăn
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  description: {
    type: String,
  },
  menu: {
    type: Schema.Types.ObjectId,
    ref: "menus",
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "restaurants",
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("foods", FoodSchema);
