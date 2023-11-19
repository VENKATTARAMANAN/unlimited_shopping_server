import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userid: {
    type: String,
  },
  productid: {
    type: String,
  },
  name: {
    type: String,
  },

  price: {
    type: Number,
  },

  image1: {
    type: String,
  },

});

const WishList = mongoose.model("Wishlist-Collection", WishlistSchema);
export { WishList };
