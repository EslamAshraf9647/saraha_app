

export const AuthorizationMidddleware = (alowedRols) =>{
   return (req,res,next) => {

    try {
        const {role:loggedInUser} = req.loggedInUser 
        const isRoleAllowed = alowedRols.includes(loggedInUser)
        console.log(
           { loggedInUser,
            alowedRols,
            isRoleAllowed}
        );
        
            if(!isRoleAllowed){
                return res.status(401).json({message:"unauthorized"})
            }
        next()
    } catch (error) {
        console.log(error);
           res.status(500).json({message:"Internal server error",error})
    }
   }
}
