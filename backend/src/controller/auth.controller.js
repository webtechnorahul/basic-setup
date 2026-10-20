import userModel from "../model/auth.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {config} from '../config/config.js'
import { emailSendFromServer } from "../utils/email.utils.js";

/**
 * 
 *token generate function
 */
async function generateToken(id,res){
    const token=jwt.sign({
        id:id
    },config.JWT_SECRET_KEY,{expiresIn:60*60});
    res.cookie("token",token);
}
/**
 * 
 * @route /api/auth/register 
 * @description new user register
 * @access anyone
 */

export async function userRegister(req,res,next){
    const {username,email,mobile,password}=req.body;
    try{
        const isUserExist=await userModel.findOne({
            $or:[
                {username},{email}
            ]
        });//check user is already exist or not

        if(isUserExist){
            if(isUserExist.username===username){
              const error=new Error("username already exist");
              error.statusCode=403;
              throw error;   
            }
            else{
                const error=new Error("user already register");
                error.statusCode=403;
                throw error;
            }
             
        }
        const hashPassword=await bcrypt.hash(password,10);//hash passord for protected
        const newUser=await userModel.create({
            username,email,mobile,password:hashPassword
        });//create new user in mongodb

        await generateToken(newUser._id,res);//generate token function call

        const userObj = newUser.toObject();
        delete userObj.password;
        res.status(201).json({message:"user register successfull",user:userObj});
    }
    catch(error){
        next(error);
    }
}

// export async function userRegister(req,res,next){
//     const {username,email,mobile,password}=req.body;
//     try{
//         const isUserExist=await userModel.findOne({
//             $or:[
//                 {username},{email}
//             ]
//         });//check user is already exist or not

//         if(isUserExist){
            
//             if(isUserExist.verify==="false"){
//                 console.log(isUserExist.verify);
//                 const otpCode=Math.floor(Math.random()*10000000).toString();
//                 const secretCode=await bcrypt.hash(otpCode,10);
//                  await emailSendFromServer(email,secretCode);
//                 return res.status(200).json({message:'user already found please verify for register'})
//             }
//             if(isUserExist.username===username ||isUserExist.verify==="true"){
//               const error=new Error("username already exist");
//               error.statusCode=403;
//               throw error;   
//             }
//             else{
//                 const error=new Error("user already register");
//                 error.statusCode=403;
//                 throw error;
//             }
             
//         }
//         const hashPassword=await bcrypt.hash(password,10);//hash passord for protected
//         const otpCode=Math.floor(Math.random()*10000000).toString();
//         const secretCode=await bcrypt.hash(otpCode,10);
//         console.log(secretCode);
//         const newUser=await userModel.create({
//             username,email,mobile,password:hashPassword,secretCode
//         });//create new user in mongodb
        
//         await emailSendFromServer(email,secretCode);

//          const cookieOptions = {
//             maxAge: 4 * 60 * 1000, // 4 Minutes
//             httpOnly: true
//         };
//         const id=newUser._id.toString();
//         res.cookie("id",id, cookieOptions);
      
//         res.status(201).json({message:"user register successfully"})
//     }
//     catch(error){
//         next(error);
//     }
// }

/**
 * @route /api/auth/login
 * @description exist user login
 * @access anyone
 */
export async function userLogin(req,res,next) {
    try{
        const {email,username,password}=req.body;
        const isUserExist=await userModel.findOne({$or:[{username},{email}]}).select("+password");//find user in databse exist or not
        if(!isUserExist){
            const error=new Error("user not found");
            error.statusCode=404;
            throw error;
        }
        if(isUserExist.verify==="false"){
            const error=new Error("user not verified please verify first");
            error.statusCode=401;
            throw error;
        }

        const isPasswordMatch=await bcrypt.compare(password,isUserExist.password);// check password in correct or not
        if(!isPasswordMatch){
            const error=new Error("incorrect password");
            error.statusCode=403;
            throw error;
        }

        await generateToken(isUserExist._id,res);//generate token
        const userObj = isUserExist.toObject();
        delete userObj.password;
        res.status(200).json({message:"login successfully",user:userObj})
    }
    catch(error){
        next(error);
    }
}

/**
 * @route /api/auth/get-me
 * @description get user function when user already have token
 * @access authorized user
 */
export async function getMeUser(req,res,next){
    try{
        const userId=req.user;

        const isUserExist=await userModel.findById({_id:userId});

        if(!isUserExist){
            const error=new Error("user not found");
            error.statusCode=404;
            throw error;
        }

        res.status(200).json({message:"user found",user:isUserExist})
    }
    catch(error){
        next(error);
    }
}

/**
 * @route /api/auth/forget-password
 * @description exist user can forget our password
 * @access anyone
 */
export async function forgetPassword(req,res,next) {
    const {email,mobile,password,confirmPassword}=req.body;
    try{
        if(password!==confirmPassword){
            const error=new Error("password not match");
            error.statusCode=400;
            throw error;
        }
        const isUserExist=await userModel.findOne({$and:[
            {email},{mobile}
        ]}).select('+password');

        if(!isUserExist){
           const error=new Error("user not found");
            error.statusCode=404;
            throw error; 
        }
        const hashPassword=await bcrypt.hash(password,10);
        await userModel.updateOne({_id:isUserExist._id},{$set:{password:hashPassword}})

        res.status(201).json({message:"reset password successfull"})
    }
    catch(error){
        next(error);
    }

}

/**
 * @route /api/auth/verify-user
 * @access pubilc
 * @description verify user when user is register
 */

export async function verifyUser(req,res,next) {
    
    const secretCode=req.query.id;
    const id=req.cookies.id;

    if(!id){
        const error=new Error("please register again");
            error.statusCode=401;
        throw error;
    }

    try{
        
        const userExist=await userModel.findById({_id:id});
        if(!userExist){
            const error=new Error("user not found");
            error.statusCode=404;
            throw error;
        }
        const isMatchSecretCode=(userExist.secretCode===secretCode);
        if(!isMatchSecretCode){
            const error=new Error("secretCode not match");
            error.statusCode=401;
            throw error;
        }
        userExist.verify=true;
        await userExist.save();

        res.status(203).json({message:'email verified'})

    }catch(error){
        next(error);
    }
    // const isSecretCodeMatch=await bcrypt.compare(otpCode,secretCode);

    // if(!isSecretCodeMatch){
    //     const error=new Error('data or otp mismatch');
    //     error.statusCode=401;
    //     throw error;
    // }

    // console.log(secretCode);
}




/**
 * @route /api/auth/google/callback
 */
export async function googleController(req,res,next) {
    try{
        const {_json}=req.user;
        let user;
        // const {id,displayName,emails,photos,provider,}=req.user;

        user=await userModel.findOne({email:_json.email});

        
        if(!user){
            const name=_json.name.replace(/\s+/g, "").toLowerCase();
            const hashNum=Math.floor(Math.random()*100000000).toString();
            const username=name.concat('_',hashNum);
            console.log(username);
            user=await userModel.create({
                username:username,
                email:_json.email,
                googleId:_json.sub,
                profileImg:_json.picture,
                verify:true
            })
        }
        user.googleId=_json.sub;
        user.verify=true;
        await user.save();
        await generateToken(user._id,res);
        res.redirect('/api/auth/dashboard');

    }
    catch(error){
        next(error); 
    }

}