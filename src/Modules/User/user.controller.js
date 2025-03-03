import { Router } from "express";
import * as profileService from './service/profile.service.js'
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { AuthorizationMidddleware } from "../../Middleware/authorization.midddleware.js";
import { ADMIN_USER, systemRoles } from "../../constants/constants.js";
import { errorhandler } from "../../Middleware/error-handler.middleware.js";

 export const usercontroller =Router()

 const {ADMIN , USER , SUPER_ADMIN} = systemRoles

 usercontroller.use(errorhandler(authenticationMiddleware()))


usercontroller.get('/profile',errorhandler(profileService.GetProfileService))
usercontroller.patch('/update-password',errorhandler(profileService.UpdatePasswordService))
usercontroller.put('/update-profile' ,errorhandler(profileService.UpdatePersonalService))
usercontroller.get('/list',errorhandler(AuthorizationMidddleware(ADMIN_USER)),errorhandler(profileService.ListUsersServices))