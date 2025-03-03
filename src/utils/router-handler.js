import { globalErrorHandler } from "../Middleware/error-handler.middleware.js";
import { authcontroller } from "../Modules/Auth/auth.controller.js";
import { messageController } from "../Modules/Message/message.controller.js";
import { usercontroller } from "../Modules/User/user.controller.js";


const routerhandler =(app) => {
    app.use('/auth',authcontroller)
    app.use('/user',usercontroller)
    app.use('/message',messageController)

    app.get('/',(req,res) => res.status(200).json({message:"welcome to saraha app"}))

    app.all('*',(req,res) => res.status(404).json({
        message:"Route not found please make sure from your url and your method"
    }))


    app.use(globalErrorHandler)
}

export default routerhandler