import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { userRouter } from "./Routes/UserRoutes.js";
import { dbConnection } from "./db.js";
import { forgotpassRouter } from "./Routes/Forgotpassword.js";
import { productRouter } from "./Routes/ProductRoutes.js";
import { adminRouter } from "./Routes/AdminRoutes.js";
dotenv.config();
dbConnection();
const app=express();
const PORT=process.env.PORT;
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use("/user",userRouter);
app.use("/forgot-pass",forgotpassRouter);
app.use("/product",productRouter);
app.use("/admin",adminRouter);
app.get("/",(req,res)=>res.send("Server working fine"));

app.listen(PORT,()=>console.log("Server Running Successfully",PORT))