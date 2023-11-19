import express from "express";
import { Users, generateJwtToken } from "../Schema/UserSchema.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
     return res.status(400).json({ message: "Email already exist" })
    }else{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const data = await new Users({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      inActive: false,
    }).save();
    res.status(201).json({ data: "Successfully Registered" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.PASSWORD,
      },
    });
    var mailOptions = {
      from: `${process.env.MAIL_ID}`,
      to: `${req.body.email}`,
      subject: "URL shortner account verification",
      text: `Click the link to verify your account : http://localhost:3000/acc-email-verify/${data._id.toString()}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json({
          data: {
            message: "Email send for verification",
          },
        });
      }
    })}
  } catch (error) {
    console.log(error);
  }
});

router.post("/signin",async(req,res)=>{
  try {
    const user = await Users.findOne({ email: req.body.email });
    if(user.inActive === true){
      if (!user) {
        return res.status(400).json({ data: "Invalid Email" });
      }
      const validatePass = await bcrypt.compare(req.body.password, user.password);
      if(!validatePass){
          return res.status(400).json({data:"Invalid password"});
      }
      const token=await generateJwtToken(user._id);
      res.status(200).json({data:"SuccessFully Logged In",token,name:user.name})
    }else{
      res.status(400).json({data:"Please Check your email to verify account"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal server error" });
  }
})

router.post("/acc-email-verify",async(req,res)=>{
try {
  const userData=await Users.findOne({_id:req.body.id});
  if(userData.inActive === true){
    res.status(200).json({data:"Email already verified successfully"});
  }else{
    const user=await Users.updateOne({_id:req.body.id},{$set:{inActive:true}})
    res.status(200).json({data:"Email verified successfully"});
  }
} catch (error) {
  console.log(error);
    res.status(500).json({ data: "Internal server error" });
}
})

export const userRouter = router;
