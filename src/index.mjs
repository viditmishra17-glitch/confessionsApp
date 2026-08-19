import express from "express"
import register from "./routers/register.mjs"
import login from "./routers/login.mjs"
import display from "./routers/displayConfessions.mjs";
import addconf from "./routers/addConfessions.mjs";
import session from "express-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from "cookie-parser";
dotenv.config();
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("mongodb successfully connected")
}).catch(()=>{
    console.log("failed to connect to mongodb");
})
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "https://confession-frontend-inky.vercel.app", credentials: true} ));
app.use(register);
app.use(login);
app.use(display);
app.use(addconf);
const PORT=process.env.PORT||3000;

// app.listen(PORT,()=>{
//     console.log("running");
// });

export default app;