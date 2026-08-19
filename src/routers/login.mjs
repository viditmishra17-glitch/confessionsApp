import {Router} from "express";
import express from "express";
import tempdata from "../resources/tempdata.mjs";
import session from "express-session";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.mjs";
const login=Router();

const validator=(req,res,next)=>{
    const user_name=req.body.username;
    const password=req.body.password;

    if(!user_name || user_name==="") return res.status(400).send("username field is empty");
    if(user_name.length<8) return res.status(400).send("username not long enough");
    next();
}
const authenticator= async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    const user=await User.findOne({email:email});

    if(!user){
        return res.status(400).send("user not authorized");
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).send("password not correct");
    }
    else{
        const refreshtoken=jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
        const accesstoken=jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});

        res.cookie('ACCESS_COOKIE',accesstoken,{
            maxAge:60*60*100*100,
            sameSite: "none",
            secure:true,
            httpOnly:true
        })
        res.cookie('REFRESH_COOKIE',refreshtoken,{
            maxAge:30*24*60*60*100,
            sameSite: "none",
            secure:true,
            httpOnly:true
        })
        res.status(200).send("successfully logged in");
    }
    next();
}
login.post('/user/refresh',authenticator , (req,res)=>{

    const refreshtoken=req.cookies.REFRESH_COOKIE;

    if(!refreshtoken){
        res.redirect('/user/login');
        return res.status(401).send("refresh token couldnt be found, login again");
    }
    try{
        const decodedpayload=jwt.verify(refreshtoken,process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken=jwt.sign({id:decodedpayload.id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'});
        res.cookie('ACCESS_COOKIE',newAccessToken,{maxAge:60*60*100});
        return res.status(200).send("access token made");
    }
    catch{
        return res.status(401).send("couldnt log in");
    }
})
login.post('/user/login',validator,authenticator)

export default login;