import {Router} from "express";
import express from "express";
import tempdata from "../resources/tempdata.mjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import User from "../models/user.mjs";
const register=Router();

const validator=async (req,res,next)=>{
    const user_name=req.body.username;
    const password=req.body.password;

    if(!user_name || user_name==="") return res.status(400).send("username field is empty");
    if(user_name.length<8) return res.status(400).send("username not long enough");
    if(password.length<8) return res.status(400).send("username not long enough");
    try{
       const hashPassword= await bcrypt.hash(password,10);
       req.body.hashPassword=hashPassword;
       console.log(hashPassword);
    }
    catch{
       return res.status(400).send("couldnt connect");
    }
    next();
}
register.post("/user/register", validator,  async (req,res)=>{
    const email=req.body.email;
    const username=req.body.username;
    const Hashpassword=req.body.hashPassword;
    try{
        const findemail=await User.findOne({email:email});
        if(findemail) throw new error();
    }
    catch{
        return res.status(400).send("email already exists, try logging in");
    }
    try{
        User.create({
            email:email,
            name: username,
            password: Hashpassword
        })
        res.status(200).send("success");
    }
    catch{
        res.status(400).send("couldnt create entry in the database");
    }
})
    
export default register;
