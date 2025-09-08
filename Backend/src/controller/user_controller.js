import mongoose from "mongoose";
import User from "../model/user_model.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import {Apierror} from "../utils/Apierror.js";
import {uploadoncloudinary} from "../utils/cloudinary.js";

const generateaccessandrefreshtoken = async (userid) => {
    const user = await User.findById(userid);
    if (!user) {
        throw new Apierror(404, "User not found while generating tokens");
    }

    const accesstoken = user.generateaccesstoken();
    const refreshtoken = user.generaterefreshtoken();

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
};







const createuser = asynchandler(async (req, res) =>{
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        throw new Apierror(400,"All fields are required");   
    }

    if(password.length < 6){
        throw new Apierror(400,"Password must be at least 6 characters long");
    }
    const existinguser = await User.findOne({email:email});

    if(existinguser){
        throw new Apierror(400,"User already exists");
    }

    let newuser;

    if(req.file?.path){
        const uploadavatar = await uploadoncloudinary(req.file.path);
        if(!uploadavatar){
            throw new Apierror(500, "Avatar upload to cloudinary failed")
        }

        newuser =  new User({
            username,
            email,
            password,
            avatar:uploadavatar.secure_url
        })

        
    }
    else{
         newuser = new User({
        username,
        email,
        password
    });
    }



   await newuser.save();

    const createUser = await User.findById(newuser._id).select("-password -refreshtoken");
    if(!createUser){
        throw new Apierror(400,"Error while creating user");
    }

    const {accesstoken,refreshtoken} = await generateaccessandrefreshtoken(newuser._id);

    const accessoptions = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge : 15 * 60 * 1000
    }

    const refreshoptions = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge : 7 * 24 * 60 * 60 * 1000
    }

    res.status(201)
    .cookie("accesstoken",accesstoken,accessoptions)
    .cookie("refreshtoken",refreshtoken,refreshoptions)
    .json(new Apiresponse(201,{user:createUser,accesstoken,refreshtoken},"user created successfully"));
})

const loginuser = asynchandler(async (req, res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new Apierror(400,"username and password are required");
    }
   

    const user = await User.findOne({email:email});

    if(!user){
        throw new Apierror(400, "Invalid user credentials")
    }
 
    const ispasswordcorrect = await user.ispasswordcorrect(password);

    if(!ispasswordcorrect){
        throw new Apierror(400,"Password not match");
    }

    const loginuser = await User.findById(user._id).select("-password -refreshtoken");

    const {accesstoken, refreshtoken} = await generateaccessandrefreshtoken(user._id);

    const accessoptions = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge : 15 * 60 * 1000
    }
    
    const refreshoptions = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"lax",
        maxAge : 7 *24 * 60 * 60 * 1000
    }

    return res
    .status(200)
    .cookie("accesstoken",accesstoken,accessoptions)
    .cookie("refreshtoken",refreshtoken,refreshoptions)
    .json(new Apiresponse(200,{user:loginuser,accesstoken,refreshtoken},"user logged in successfully"));

})

const logout = asynchandler(async (req, res) =>{
    // console.log(req.user);
     await User.findByIdAndUpdate(req.user.id,{
        $set:{refreshtoken:""}
     })

     const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        samesite:"lax",
       
    }
     
   res.clearCookie("accesstoken",options);
   res.clearCookie("refreshtoken",options);
   return res.status(200).json(new Apiresponse(200,null,"user logged out successfully"));
})

const updateprofile = asynchandler(async (req, res) =>{
    const user =await  User.findById(req.user.id);
      if (!user) {
        throw new Apierror(404, "User not found");
    }

    if(req.file?.path){
        const upload =await  uploadoncloudinary(req.file.path)
        if(!upload){
            throw new Apierror(404, "Avatar upload to cloudinary failed")
        }
        user.avatar = upload.secure_url;
        await user.save();
    }
    else{
        throw new Apierror(400,"image not get from user");
    }
     res
      .status(200)
      .json(new Apiresponse(200, user, "Profile updated successfully"));
})


export {createuser,loginuser,logout,updateprofile};