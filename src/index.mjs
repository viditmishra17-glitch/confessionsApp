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
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("mongodb successfully connected");
}
const app=express();
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.log("failed to connect to mongodb:", err.message);
        return res.status(500).send("database connection failed");
    }
});
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