import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { Admin } from "../Schema/AdminSchema.js";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../Schema/UserSchema.js";
const router = express.Router();

router.post("/login",async(req,res)=>{
    const data=req.body;
    try {
        const log=await Admin.findOne({email:data.email})

        if (!log) {
            return res.status(400).json({ data: "Invalid email" });
          }
          const validPassword = await bcrypt.compare(
            req.body.password,
            log.password
          );
          if (!validPassword) {
            return res.status(400).json({ data: "Invalid Password" });
          } else {
            const token = await generateJwtToken(log._id);
            res.status(200).json({data:"Successfully logged in", token});
            };
          }
    catch (error) {
        console.log(error);
        res.status(400).json({data:"Internal server error"})
    }
})

export const adminRouter = router;

