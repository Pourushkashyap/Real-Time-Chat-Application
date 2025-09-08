import express from "express";
import { createuser,loginuser,logout,updateprofile } from "../controller/user_controller.js";
import {upload} from "../middleware/multer_middleware.js"
import { verifyjwt } from "../middleware/verifyjwt.js";
import User from "../model/user_model.js";
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("user route is working");
})

router.post("/register",upload.single("avatar"),createuser);

router.post("/login",loginuser);

router.post("/logout",verifyjwt,logout);

router.get("/me",verifyjwt,async (req,res)=>{
    
    const user = await User.findById(req.user.id).select("-password -refreshtoken");
  
    res.status(200).json({loggintrue:true,user});
})

router.put("/updateprofile",upload.single("avatar"),verifyjwt,updateprofile);

export default router;