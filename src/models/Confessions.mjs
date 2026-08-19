import mongoose from "mongoose";

const ConfessSchema=mongoose.Schema({
    title:{type:String, required:true},
    body:{type:String,required:true}
})

const Confess=mongoose.model("Confessions",ConfessSchema);
export default Confess;