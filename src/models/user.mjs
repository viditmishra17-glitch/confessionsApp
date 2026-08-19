import mongoose from "mongoose";
import Confess from "./Confessions.mjs";
const UserSchema=new mongoose.Schema({
    email: {type: String, required:true},
    name: {type: String, required:true},
    password: {type: String,required:true},
    Confessions: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Confess",
    }]
})

const User=mongoose.model("user",UserSchema);

export default User;