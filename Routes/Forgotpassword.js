import express from "express";
import bcrypt from "bcrypt";
import Randomstring from "randomstring";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { Users, generateJwtToken } from "../Schema/UserSchema.js";
dotenv.config();

const router = express.Router();

router.post("/forpass-verify-mail", async (req, res) => {
  try {
    const verify = await Users.findOne({ email: req.body.email });
    if (!verify) {
      return res.status(400).json({ data: "Invalid Email" });
    } else {
      let randstring = Randomstring.generate({
        length: 12,
        charset: "alphabetic",
      });
      const token = await generateJwtToken(randstring);
      const addString = await Users.updateOne(
        { email: verify.email },
        { $set: { otp: randstring, token: token } }
      );
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.PASSWORD,
        },
      });
      var mailOptions = {
        from: `${process.env.MAIL_ID}`,
        to: `${verify.email}`,
        subject: "Unlimited shopping site password",
        text: `Please use the CAPTCHA CODE to reset your Password : ${randstring}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          res.status(200).json({
            data: {
              message: "OTP send successfully",
              token: token,
            },
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

router.post("/forgot-verOtp", async (req, res) => {
  try {
    const verifyOtp = await Users.findOne({ token: req.body.token });
    if (req.body.otp === verifyOtp.otp) {
      res.status(200).json({ data: "Otp Verified Successfully" });
    } else {
      res.status(400).json({ data: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

router.put("/forgot-changePass", async (req, res) => {
  try {
    let findUser = await Users.findOne({ token: req.body.token });
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
    const changePass = await Users.updateOne(
      { _id: new ObjectId(findUser._id) },
      { $set:{password:hashedpassword} }
    );
    const remove_tok_otp=await Users.updateOne({_id: new ObjectId(findUser._id)},{$unset:{token:"",otp:""}}) ;
    if (changePass) {
      res.status(200).json({ data: "Password reset SuccessFully" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

export const forgotpassRouter = router;
 