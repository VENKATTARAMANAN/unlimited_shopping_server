import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { Admin } from "../Schema/AdminSchema.js";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../Schema/UserSchema.js";
import { Product } from "../Schema/ProductSchema.js";
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

router.post("/add-product",async(req,res)=>{
  const value=req.body;
  try {
    const addproduct=await new Product(value).save();
    if (addproduct){
      res.status(200).json({data:"Product added successfully"})
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({data:"Internal server error"})
  }
})

router.delete("/delete-product/:id",async(req,res)=>{
 const value=req.params.id;
  try {
    const delprod=await Product.deleteOne({_id:value})
    if(delprod){
      res.status(200).json({data:"Product deleted successfully"});
    }else{
      res.status(400).json({data:"Product not found"});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({data:"Internal server error"})
  }
})

router.put("/edit-product",async(req,res)=>{
try {
  const value=req.body.values;
  const param={_id:req.body.params};
  const editdata=await Product.findOneAndUpdate(param,value);
  if(editdata){
    res.status(200).json({data:"Product updated successfully"});
  }else{
    res.status(200).json({data:"Product not found"})
  }
} catch (error) {
  console.log(error);
  res.status(400).json({data:"Internal server error"})
}

})
export const adminRouter = router;

