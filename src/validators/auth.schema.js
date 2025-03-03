import Joi from "joi";

export const SignUpSchema = {
    body:Joi.object({
        username:Joi.string().required().alphanum().length(10).messages({
            "string.alphanum":"Username must be alphanumeric should contain only a-z , A-Z and 0-9",
            "string.base":"Username must be a string",
            "string.length":"Username must be 10 characters long",
            "any.required":"Username must be required"
        }),
        email :Joi.string().email({
            tlds:{
                allow:['com' ,'yahoo'],
                deny:['net','org','io']
            },
            maxDomainSegments:2,
            multiple:true,
            separator:'#'
        }),
        password:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages({
            'string.pattern.base':"password must be at least 8 characters long and contain at least one uppercase and one lowercase and speacial characters[@$!*%]"
        }),
        confirmPassword:Joi.string().required().valid(Joi.ref('password')),
        phone:Joi.string().required(), 
        age:Joi.number().min(18).required().messages({
            "number.min":"Age must be greater than 18 years old",
            "any.required":"Age is required"
        })
    })

}