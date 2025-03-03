import Message from "../../../DB/models/message.model.js"
import { User } from "../../../DB/models/user.model.js"



export const SendMessageService = async(req,res)=>{

    const {body , ownerId} = req.body

    // check if owner id is vaild

    const user = await User.findById(ownerId)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    
    const message = await Message.create({
        body,
        ownerId,
    })

    res.status(201).json({message:"message sent successfully",message})
}


export const getMessageService = async (req,res) => {
    const message = await Message.find({})
    .populate(
        [
            {
                path:"ownerId",
                select:"-password -__v"
            }
        ],
    )
    res.status(200).json({message:"success",data:message})
}


export const getUserMessageService = async (req,res) => {
    const {_id} = req.loggedInUser
    const message =await Message.find({ownerId:_id})

    // chech if user send message or not  
    
    if(message.length === 0){
        return res.status(404).json({message:"user doesnot send any message"})
    }
    res.status(200).json({message:"success",data:message})

}