import express from "express";
import * as dotenv from "dotenv"
import mongoose from "mongoose";
dotenv.config();

export function dbConnection(){
    const MONGO_URL=process.env.MONGO_URL;
   
    try {
        mongoose.connect(MONGO_URL);
        console.log("Mongodb connected successfully");
    } catch (error) {
        console.log("Internal server error",error);
    }
}
