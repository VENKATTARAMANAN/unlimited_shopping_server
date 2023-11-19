import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  otp: {
    type: String,
  },
  inActive: {
    type: Boolean,
  },
});

export const generateJwtToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

export const decodeJwtToken = (token) => {
  return jwt.decode(token);
};

const Users = mongoose.model("user-collection", UserSchema);
export { Users };
