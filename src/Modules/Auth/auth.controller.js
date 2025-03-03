import { Router } from "express";
import * as authservices from './services/authentication.service.js'
import { ValidationMiddleware } from "../../Middleware/validation.middleware.js";
import { SignUpSchema } from "../../validators/auth.schema.js";
 export const authcontroller =Router()

authcontroller.post('/signup',ValidationMiddleware(SignUpSchema),authservices.SignUpService)
authcontroller.post('/signin',authservices.SignInService)
authcontroller.get('/verify-email/:token',authservices.VerfiyEmailService)
authcontroller.post('/refresh-token',authservices.RefreshTokenService)
authcontroller.post('/signout',authservices.SignOutService)
authcontroller.patch('/forget-password',authservices.ForgetPasswordService)
authcontroller.put('/reset-password',authservices.ResetPasswordService)

