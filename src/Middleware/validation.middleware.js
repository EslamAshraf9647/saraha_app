

export const ValidationMiddleware = (schema) => {
    return (req,res,next)=>{
        const schemakeys = Object.keys(schema)
        
        let ValidationErrors = []
        for(const key of schemakeys){
            const {error} =schema[key].validate(req[key],{abortEarly:false})
            if(error){
                 ValidationErrors.push(...error.details)
            }
        }
        if(ValidationErrors.length){
            return res.status(400).json({message:"validation error",error:ValidationErrors})
         }
         next()
    }
}


