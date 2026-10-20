import nodemailer from 'nodemailer'
import { config } from '../config/config.js'

/** 
 * @connection nodemailer connection code
 */
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:config.GOOGLE_EMAIL_USER,
        clientId:config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        refreshToken:config.GOOGLE_REFRESH_EMAIL_KEY
    }
});//connection code end

//verify connection is build or not
transporter.verify()
.then(()=>{console.log("smtp ready to send email")})
.catch((error)=>{console.log("smtp are not connected")})//end to check connection build

/**
 * @create create a function to send email
 * @use use in register time , login time
 */

export const sendEmail=async (to,subject,Text,html)=>{
    console.log("email utils call");
    console.log(to,subject,Text,html);
    try{
        const info=await transporter.sendMail({
            from: `"Your Name" <${config.GOOGLE_EMAIL_USER}>`, // sender address
            to:to, // list of receivers
            subject:subject, // Subject line
            text:Text, // plain text body
            html:html, // html body
            
        })
        console.log("Email sent successfully: %s", info.messageId);
        return info;
    }
    catch(error){
        console.error("Error sending email:", error);
        throw error;
    }
}


export default transporter