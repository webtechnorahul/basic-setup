import jwt from 'jsonwebtoken'
import { config } from '../config/config.js';

export const identifyUser=(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            const error=new Error("unauthorized access");
            error.statusCode=403;
            throw error;
        }

        const isVerifyed=jwt.verify(token,config.JWT_SECRET_KEY);
        if(!isVerifyed){
            const error=new Error("unauthorized access");
            error.statusCode=401;
            throw error;
        }
        req.user=isVerifyed.id;
        next();
    }
    catch(error){
        next(error);
    }
}