import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const AdminSchema = new mongoose.Schema({
email:{
    type:String
},
password:{
    type:String
}
})

const Admin = mongoose.model("Admin-collection", AdminSchema);
export { Admin };
