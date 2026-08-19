import {Router} from "express";
import express from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Confess from "../models/Confessions.mjs";
import User from "../models/user.mjs";
const display=Router();
display.use(express.json());
const authenticator = (req, res, next) => {
    const accesstoken = req.cookies.ACCESS_COOKIE;
    if (!accesstoken) {
        return res.status(401).send("user not authenticated");
    }

    try {
        const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        req.userid = decoded;
        return next();

    }
    catch(error) {
        console.log(error);
        return res.status(400).send("invalid token");
    }
}

display.get('/confessions/show', authenticator,async (req,res)=>{

    const allconfessions=await Confess.find().lean();
    const user=await User.findById(req.userid.id).lean();
    const map=new Map();
    for(let i=0;i<user.Confessions.length;i++){
        map.set(user.Confessions[i]._id.toString(),true);
    }

    const ResultConfessions=[];
    for(let i=0;i<allconfessions.length;i++){
        const conf={...allconfessions[i],isUser:false};
        const isuser=map.get(conf._id.toString());
        if(isuser){
            console.log("here");
            conf.isUser=true;
        }
        console.log(conf._id);
        ResultConfessions.push(conf);
    }
    return res.status(200).send(ResultConfessions);

})
export default display;