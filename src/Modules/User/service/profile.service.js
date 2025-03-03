import { hashSync,compareSync } from "bcrypt"
import { User } from "../../../DB/models/user.model.js"
import { Decryption, Encryption } from "../../../utils/encryption.utils.js"
import BlackListTokens from "../../../DB/models/black-list-tokens.js"
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from "uuid"
import emailTemplate from "../../../utils/email-templete.utils.js"
import { emitter } from "../../../Services/send-email.service.js"



export const GetProfileService =async (req,res) => {
    
        const {_id} =req.loggedInUser
        _id=7777
        const user = await User.findById(_id)
        if(!user) return res.status(404).json({message:"user not found"})

        user.phone =  await Decryption({cipher:user.phone , secretKey:process.env.ENCRYPTED_KEY})
        return res.status(200).json({message:"user found successfully",user})
        
    
}


export const UpdatePasswordService = async (req,res) => {
    
        const {_id} = req.loggedInUser
        const {oldPassword , newPassword , ConfirmPassword}= req.body
        if(newPassword!= ConfirmPassword){
            return res.status(400).json({message:'password not equal confirmPassword'})
        }
    const user = await User.findById(_id)
     const isPasswordMatched =compareSync(oldPassword, user.password)   
             if(!isPasswordMatched) return res.status(400).json({message:"Invaild password"})

    // hashed Password 
    const hashedPassword =hashSync(newPassword, +process.env.SALT)
    user.password= hashedPassword
    await user.save()

    // revoke token 
    await BlackListTokens.create(req.loggedInUser.token)
    res.status(200).json({message:"Password updated successfully"})


  
}

export const UpdatePersonalService = async(req,res)  => {
   
        const {_id} = req.loggedInUser
        const {email, username, phone} = req.body

        const user = await User.findById(_id)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        if(username) user.username = username
        if(phone) user.phone =Encryption({value:phone , secretKey:process.env.ENCRYPTED_KEY})
        if(email){
            const isEmailExsist =await User.findOne({email})
        if(isEmailExsist){
            return res.status(409).json({message:"Email is already Exsist"})
        }
       const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET_LOGIN,{expiresIn:"1h",jwtid:uuidv4()})
       
       const confrimationLink = `${req.protocol}://${req.headers.host}/auth/verify-email/${token}`
       emitter.emit('SendEmail',
        {
            to:email,
            subject:'verfiy your Email ',
            html:emailTemplate(username  , confrimationLink)
        }
      )
      user.email=email
      user.isEmailVerified=false
        }
        await user.save()
       res.status(200).json({message:"user profile updated successfully",user})

    
} 

export const ListUsersServices = async(req,res) => {
  
        const user = await User.find({},'-password,-__v')
        res .status(200).json({message:"All Users" , user})
}