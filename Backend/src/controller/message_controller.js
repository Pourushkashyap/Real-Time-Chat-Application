import Message from "../model/message_model.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asynchandler } from "../utils/Asynchandler.js";
import User from "../model/user_model.js";
import { getReceiverSocketId,io } from "../utils/socket.js";

const getusersforsidebar= asynchandler(async (req,res)=>{
  
     const loggedinuser = req.user.id;

     const user = await User.find({_id:{$ne:loggedinuser}}).select("-password -refreshtoken")

     res.status(200).json(new Apiresponse(200,user,"Users fetched successfully"));  
     
     
})


const getMessages = asynchandler(async(req,res) => {
    const {id:usertochatId} = req.params;
    const senderid = req.user.id;

    const messages = await Message.find({
         $or:[
            {senderId:senderid, receiverId:usertochatId},
            {senderId:usertochatId, receiverId:senderid}
         ]
    })

    res.status(200).json(new Apiresponse(200,messages,"Messages fetched successfully"));
})



const sendmessage = asynchandler(async(req,res) =>{
    const {text} = req.body;

    const {id:receiverId} = req.params;

    const senderId = req.user.id;

    let imageurl;
    if(req.file?.path){
        const uploadresponse = await cloudinary.uploader.upload(req.file.path,{
            folder:"messages",
            resource_type:"auto"
        });
        imageurl = uploadresponse.secure_url;
    }

    
    const newmessage = await Message.create({
        
        senderId,
        receiverId,
        text,
        image:imageurl
    })

    await newmessage.save();
    const receivesocketId = getReceiverSocketId(receiverId);
    if(receiverId){
        io.to(receivesocketId).emit("newMessage",newmessage);
    }

    

    res.status(201).json(new Apiresponse(201,newmessage,"Message sent successfully"));
})

export {getusersforsidebar,getMessages,sendmessage};