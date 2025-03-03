import { compareSync, hashSync } from "bcrypt"
import { User } from "../../../DB/models/user.model.js"
import { Encryption } from "../../../utils/encryption.utils.js"
import { emitter} from "../../../Services/send-email.service.js"
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from "uuid"
import BlackListTokens from "../../../DB/models/black-list-tokens.js"
import emailTemplate from "../../../utils/email-templete.utils.js"

export const SignUpService =async(req,res) => {
    try {
        const {username,email,password,confirmPassword,phone, age} = req.body
        if(password != confirmPassword){
            return res.status(400).json({message:'password not equal confirmPassword'})
        }
        const isEmailExsist =await User.findOne({email})
        if(isEmailExsist){
            return res.status(409).json({message:"Email is already Exsist"})
        }
         
           // Hashed Password

        const hashedPassword =hashSync(password, +process.env.SALT)

        // Encrypted Phone

        const encryptedPhone =  await Encryption({value:phone,secretKey:process.env.ENCRYPTED_KEY})

        //JWT tokens 

        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1h"})

             const ConfirmEmailLink =`${req.protocol}://${req.headers.host}/auth/verfiy/${token}`

             
  
             // send verfication Email with OTP 

          emitter.emit('SendEmail',
            {
                to:email,
                subject:'verfiy your Email ',
                html:emailTemplate(username  , ConfirmEmailLink)
            }
          )
                  
        const newuser =new User({
             email,
             password:hashedPassword,
             username,
             phone:encryptedPhone,
             age})
        const user =await newuser.save()
        if(!user){
            return res.status(500).json({message:"create user is failed"})
        }
        return res.status(200).json({message:"user created sucessfully",user})


    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error",error})
    }
}

export const VerfiyEmailService = async(req,res) => {
    try {
        const {token}= req.params
        const decodedData = jwt.verify(token,process.env.JWT_SECRET_LOGIN)
     
        const user =await User.findOneAndUpdate({_id:decodedData._id},{isEmailVerified:true},{new:true})
        if(!user){
            return res.status(404).json({message:'user not found'})
        }

        res.status(200).json({message:'Email Verified Sucessfully',user})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Internal Server Error',error})
        
    }
}

export const SignInService = async (req,res) => {
    try {
        const {email , password} = req.body
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message:"Invaild Email or password"})

         const isPasswordMatched =compareSync(password, user.password)   
         if(!isPasswordMatched) return res.status(404).json({message:"Invaild Email or password"})

          const accesstoken =jwt.sign(
            {_id:user._id, email:user.email},
            process.env.JWT_SECRET_LOGIN,
            {expiresIn:"1h",jwtid:uuidv4()})  
          
          const refreshtoken =jwt.sign(
            {_id:user._id, email:user.email},
            process.env.JWT_SECRET_REFRESH,
            {expiresIn:"2d",jwtid:uuidv4()}) 

            return res.status(200).json({message:"user loged in successfully",isPasswordMatched,accesstoken,refreshtoken})
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Inernal server error"})
        
    }
}

export const RefreshTokenService =async (req,res) => {
    try {
        const {refreshtoken}=req.headers;
        const decodedData =jwt.verify(refreshtoken,process.env.JWT_SECRET_REFRESH)
        const accesstoken =jwt.sign({_id:decodedData._id, email:decodedData.email},process.env.JWT_SECRET_LOGIN,{expiresIn:"1h"})
        res.status(200).json({message:"accesstoken refreshed successfully",accesstoken})  
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Inernal server error",error})
        
    }
}

export const SignOutService = async (req,res) => {
    try {
        const {accesstoken,refreshtoken} = req.headers;
        const decodedData =jwt.verify(accesstoken,process.env.JWT_SECRET_LOGIN) 
        const decodedRefershToken =jwt.verify(refreshtoken,process.env.JWT_SECRET_REFRESH)
       // insert token id to black list 
       
       await BlackListTokens.insertMany([
        {
            tokenId:decodedData.jti,
            expiryDate:decodedData.exp
        },
        {
            tokenId:decodedRefershToken.jti,
            expiryDate:decodedRefershToken.exp
        }
       ])
       res.status(201).json({message:"user logged out successfully"})
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Inernal server error",error})
        
    }
}

export const ForgetPasswordService = async(req,res) => {
    try {
        const {email} = req.body
        const user= await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"this email is not registred"})
        }
       
        // generate otp 

        const otp= Math.floor(100000 + Math.random() * 10000)    
        const otp_expires =new Date(Date.now() + 5 * 70 *1000) 
        
        // Calculate the remaining minutes before OTP expires
           const now = new Date();
         const otpExpirationMinutes = Math.round((otp_expires - now) / (1000 * 60)); // Convert milliseconds to minutes

       // Send OTP via email
        emitter.emit("SendEmail", {
          to: email,
          subject: "Reset your password",
          html: `<h1>Welcome to Saraha App</h1>
                 <p>OTP is <strong>${otp}</strong></p>
                 <p><strong>Note:</strong> The OTP will expire in ${otpExpirationMinutes} minutes.</p>`, 
});

     
    // hashed otp and save it to database

        const hashedOtp = hashSync(otp.toString(),10) 
        user.otp=hashedOtp,
        user.otp_expires = otp_expires
        await user.save()

       // Send response to the user
       res.status(200).json({
        message: "OTP sent successfully",
        otpExpiration:` The OTP will expire in ${otpExpirationMinutes} minutes.`,
});


    }
     catch (error) {
            console.log(error);
            res.status(500).json({message:"Inernal server error",error})
    }
}

export const ResetPasswordService= async(req,res) => {
    try {
        const {email , otp , password , confirmPassword} = req.body
        if(password != confirmPassword){
            return res.status(400).json({message:'password not equal confirmPassword'})
        }
        const user= await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"the Email is not registred"})
        }
        // check if is OTP has expires 

        if(!user.otp_expires || new Date() > new Date (user.otp_expires))
        {
            return res.status(400).json({message:"OTP Expired"})
        }

        // verfit the OTP
        const isOtpMatched = compareSync(otp.toString(), user.otp)
        if(!isOtpMatched){
            return res.status(400).json({message:"Invaild Otp "})
        }

        // Hash the password

        const hashedPassword = hashSync(password, +process.env.SALT)

        // update password and remove otp and otp expiry
        
        await User.updateOne({email},
            {password:hashedPassword, $unset:{otp:"", otp_expires:""}})
         
        res.status(200).json({message:"Passwoed Reset Successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Inernal server error",error})
    }
} 
