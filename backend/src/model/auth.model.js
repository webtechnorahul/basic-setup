import mongoose from "mongoose";
/**
 * user model 
 * @required username email 
 * @unique username email googleId faceAuthKey
 * 
 * {
 * username:
 * email
 * mobile
 * password
 * }
 */
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username is already exist"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email is already exist"]
    },
    googleId:{
        type:String,
        unique:[true,"google is already exist"],
        default:null,
        
    },
    mobile:{
        type:String,
        required:function (){
            return !this.googleId;
        },
    },
    profileImg:{
        type:String,
        default:'https://ik.imagekit.io/pfhclblv5/shared/usericon.png?updatedAt=1773069247849'
    },
    password:{
        type:String,
        select:false,
        required:function (){
            return !this.googleId;
        },
    },
    verify:{
        type:String,
        default:false,
        enum:["false","true"]
    },
    role:{
        type:String,
        deafult:'user',
        enum:["admin","user"]
    },
    secretCode:{
        type:String,
        required:function (){
            return !this.googleId;
        },
    },
    faceAuthKey:{
        type:String,
        default:null
    },
},{timestamps:true},
{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password; // Automatically removes password from JSON responses
            return ret;
        }
    },
    toObject: {
        transform: function (doc, ret) {
            delete ret.password; // Automatically removes password from .toObject() calls
            return ret;
        }
    }
}
);

userSchema.index({username:1,email:1},{unique:true});

const userModel= mongoose.model("User",userSchema);

export default userModel;