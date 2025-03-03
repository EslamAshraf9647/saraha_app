import mongoose from "mongoose";

const blacklisttokensSchema =new mongoose.Schema({
    tokenId:{type:String,required:true,unique:true},
    expiryDate:{type:String,required:true},
},{timestamps:true})

const BlackListTokens = mongoose.models.BlackListTokens || mongoose.model("BlackListTokens",blacklisttokensSchema)

export  default BlackListTokens