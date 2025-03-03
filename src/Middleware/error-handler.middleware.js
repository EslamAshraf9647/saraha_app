


export const errorhandler = (api) => {
    return (res,req,next)=>{
    api(res,req,next).catch((error)=>{
        console.log(`Error in ${req.url} from errorhandler middleware`,error);
        return next (new Error (error.message , {cause:500}))
    })
}
}


export const globalErrorHandler = (error,req,res,next) => {
    console.log(`Global error handler:${error.message}`);
    return res.status(500).json({message:"Internal server error",error:error.message})
    
}