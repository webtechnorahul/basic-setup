import { Router } from "express";
import passport from 'passport'
import { forgetPassword, getMeUser, googleController, userLogin, userRegister, verifyUser } from "../controller/auth.controller.js";
import handleValidationError, { forgetPasswordRules, loginUserRules, registerUserRules } from "../validation/auth.validation.js";
import { identifyUser } from "../middleware/auth.middleware.js";
import GoogleStrategy from 'passport-google-oauth20';
import { config } from "../config/config.js";

const authRouter=Router();

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL
  },function (_,__,profile,done){
    return done(null,profile);
  }
));
// @route /api/auth/register
authRouter.post('/register',registerUserRules,handleValidationError,userRegister);

// @route /api/auth/login
authRouter.post('/login',loginUserRules,handleValidationError,userLogin);
authRouter.get('/login',(req,res)=>{
  res.send("login failed")
})
authRouter.get('/dashboard',(req,res)=>{
  res.send("login successfull")
})
// @route /api/auth/get-me
authRouter.get('/get-me',identifyUser,getMeUser);
authRouter.get('/verify-user',verifyUser)

// @route /api/auth/forget-password
authRouter.patch('/forget-password',forgetPasswordRules,handleValidationError,forgetPassword);

// @route /api/google/auth
authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

authRouter.get('/google/callback', 
  passport.authenticate('google', {session:false, failureRedirect: '/login' }),
  googleController);

  
export default authRouter