import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLen:6
    },
    avatar:{
        type:String,
        default:"",
    },
    refreshtoken:{
        type:String,
        default:""
    }
})

userschema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
        this.password = await bcrypt.hash(this.password,10);
        next();
})

userschema.methods.ispasswordcorrect = async function(password){
    return bcrypt.compare(password,this.password);
}

userschema.methods.generateaccesstoken = function(){
    return jwt.sign({
        id:this._id,
        username:this.username,
        email:this.email

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }

)
}

userschema.methods.generaterefreshtoken = function(){
    return jwt.sign({
        id:this._id,

    },
process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}



const User = mongoose.model("User",userschema);
export default User;