import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  flag: {
    type: Boolean,
    default:false
  },
  price: {
    type: Number,
  },
  ratings: {
    type: String,
  },
  brand: {
    type: String,
  },
  color: {
    type: String,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  quantity: {
    type: Number,
    default:"30"
  },
  category: {
    type: String,
  },
});
const Product = mongoose.model("Product-collection", ProductSchema);
export { Product };
