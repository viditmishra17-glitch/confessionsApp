import express from "express";
import { Router } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.mjs";
import Confess from "../models/Confessions.mjs";
const addconf = Router();
const authenticator = (req, res, next) => {
    const accesstoken = req.cookies.ACCESS_COOKIE;
    if (!accesstoken) {
        return res.status(401).send("user not authenticated");
    }

    try {
        const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
        req.body.userid = decoded;
        console.log(decoded);
        return next();

    }
    catch {
        return res.status(400).send("invalid token");
    }
}

addconf.post('/confessions/add', authenticator, async (req, res) => {
    const { body: { userid, title, confessionbod } } = req;
    if(!userid) return res.status(400).send("bad user");
    try {
        console.log("Starting database lookup");
        const user =await  User.findById(userid.id);
        console.log("Database lookup finished!");


        if(!user) return res.status(400).send("user not found");
        
        const Post = await Confess.create({
            title: title,
            body: confessionbod
        });
        if(!Post) return res.status(400).send("post couldnt be created");

        if (!user.Confessions) {
            user.Confessions = [];
        }
        user.Confessions.push(Post);
        await user.save();
        return res.status(200).send("successfully stored confession");
    }
    catch {
        return res.status(400).send("failed to add confession");
    }
})
export default addconf;