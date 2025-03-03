import nodemailer from "nodemailer"
import { EventEmitter } from "node:events"


export const SendEmailService = async(
    {
         to,
         subject,
         html,
         attachments =[]
    }
) => {
    try {
        const transporter =nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            },
            // tls:{
            //     rejectUnauthorized:false
            // }
        })

        const info =await transporter.sendMail({
            from:`"NO_REPLY"<${process.env.EMAIL_USER}>`,
            to, // list of receivers
            subject, // subject line 
            html, // html body 
            attachments
        })

        return info

    } catch (error) {
        console.log("error in sending email",error);
        return error;
        
    }
}


export const emitter = new EventEmitter();

emitter.on('SendEmail', (...args)=>{
    console.log('Event Triggerd',args);
    
    const {to,subject,html,attachments}=args[0]
    SendEmailService({
        to,
        subject,
        html,
        attachments
    })
})