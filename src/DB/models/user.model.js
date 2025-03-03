import mongoose from "mongoose";
import{ systemRoles} from "../../constants/constants.js";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username is already taken"],
        lowercase:true,
        trim:true,
        minLenght:[4,"Username must be greater than 4 characters"],
        maxLenght:[20,"Username must be less than 20 characters"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email is already taken"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    phone:{
        type:String,
        required:[true,"phone is required"],
    },
    age:{
        type:Number,
        required:[true,"age is required"],

    },
   
    isDeleted:{
        type:Boolean,
        default:false,
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    profileImage:String,
    otp:String,
    otp_expires:Date,
    role:{
        type:String,
        default:systemRoles.USER,
        enum:Object.values(systemRoles)
    }
},{
    timestamps:true,
})

export const User =mongoose.models.User || mongoose.model('User',userSchema)