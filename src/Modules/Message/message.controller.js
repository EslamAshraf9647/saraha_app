import { Router } from "express";
import * as messageService from  './Service/message.service.js'
import { errorhandler } from "../../Middleware/error-handler.middleware.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";


export const messageController = Router()

messageController.post('/send',errorhandler(messageService.SendMessageService))
messageController.get('/list',errorhandler(messageService.getMessageService))
messageController.get('/userMessage',authenticationMiddleware(),errorhandler(messageService.getUserMessageService))



