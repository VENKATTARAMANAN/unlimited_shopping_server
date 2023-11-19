import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { Product } from "../Schema/ProductSchema.js";
import { WishList } from "../Schema/WishListSchema.js";
import { decodeJwtToken } from "../Schema/UserSchema.js";

const router = express.Router();

router.get("/alldata", async (req, res) => {
  try {
    const productdata = await Product.find({});
    if (productdata) {
      res.status(200).json({ data: productdata });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

router.post("/add-wishlist", async (req, res) => {
  try {
    const { token, data } = req.body;
    const userid = await decodeJwtToken(token);
    const value = {
      userid: userid.id,
      productid: data._id,
      image1: data.image1,
      name: data.name,
      price: data.price,
    };
    const wishlistdata = await new WishList(value).save();
    if (wishlistdata) {
      res.status(200).json({ data: "Producted added to wishlist" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

router.delete('/remove-wishlist/:id', async (req, res) => {
  try {
    const token = decodeJwtToken(req.headers.authorization);
    const removeItem = await WishList.deleteOne({userid: token.id, productid: req.params.id});
    if(removeItem) {
      res.status(200).json({data: "Product removed from wishlist"});
    } else {
      res.status(400).json({data: "Internal server error"});
    }
  } catch (error) {
    console.log('error::: ', error);
  }
})

router.post("/get-wishlist",async(req,res)=>{
try {
  const token=req.body.token;
  const tokenVal=await decodeJwtToken(token)
  const getwishlist=await WishList.find({userid:tokenVal.id})
  if(getwishlist){
res.status(200).json({data:getwishlist});
  }
} catch (error) {
  console.log(error);
  res.status(400).json({ data: "Internal server error" });
}
})

router.get("/get-product/:id", async (req, res) => {
  const data = req.params.id;
  try {
    const getdata = await Product.findOne({ _id: data });
    if (getdata) {
      res.status(200).json({ data: getdata });
    } else {
      res.status(400).json({ data: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

router.get("/get-catwise-data/:id",async(req,res)=>{
  const data=req.params.id;
  try {
    const getdata=await Product.find({category:data});
    if(getdata){
      res.status(200).json({data:getdata});
    }else{
      res.status(204).json({data:"No Product found"})
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
})

router.post("/srh-fil-cat",async(req,res)=>{
try {
  let val=req.body.checkval;
      const value=await Product.find({category:val})
     if(value){
      res.status(200).json({data:value});
     }
} catch (error) {
  console.log(error);
  res.status(400).json({ data: "Internal server error" });
}
})

router.post("/star-rating",async(req,res)=>{
  try {
    let val=req.body.checkval;
    const value=await Product.find({ratings:{$gt:val[0]}})
    if(value){
      res.status(200).json({data:value});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

router.post("/brand-filter",async(req,res)=>{
  try {
    let val=req.body.checkval;
    const value=await Product.find({brand:val})
    if(value){
      res.status(200).json({data:value});
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Internal server error" });
  }
});

export const productRouter = router;
