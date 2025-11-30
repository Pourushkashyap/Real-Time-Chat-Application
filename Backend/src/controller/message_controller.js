import Message from "../model/message_model.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asynchandler } from "../utils/Asynchandler.js";
import User from "../model/user_model.js";
import { getReceiverSocketId, io } from "../utils/socket.js";   // ✔️ FIXED
import { v2 as cloudinary } from "cloudinary";                   // ✔️ FIXED


// =========================
//  GET USERS FOR SIDEBAR
// =========================
const getusersforsidebar = asynchandler(async (req, res) => {
  const loggedinuser = req.user.id;

  const users = await User.find({ _id: { $ne: loggedinuser } })
    .select("-password -refreshtoken");

  res.status(200).json(
    new Apiresponse(200, users, "Users fetched successfully")
  );
});


// =========================
//  GET MESSAGES BETWEEN USERS
// =========================
const getMessages = asynchandler(async (req, res) => {
  const { id: userToChatId } = req.params;
  const senderId = req.user.id;

  const messages = await Message.find({
    $or: [
      { senderId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: senderId },
    ]
  });

  res.status(200).json(
    new Apiresponse(200, messages, "Messages fetched successfully")
  );
});


// =========================
//  SEND MESSAGE CONTROLLER
// =========================
const sendmessage = asynchandler(async (req, res) => {
  const { text } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user.id;

  let imageurl;

  // ✔️ Upload image to Cloudinary if exists
  if (req.file?.path) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "messages",
      resource_type: "auto",
    });

    imageurl = upload.secure_url;
  }

  // ✔️ Create message
  const newmessage = await Message.create({
    senderId,
    receiverId,
    text,
    image: imageurl,
  });

  // ✔️ Find receiver socket
  const receiverSocketId = getReceiverSocketId(receiverId);

  // ONLY emit if user is online
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newmessage);  // ✔️ FIXED
  }

  res.status(201).json(
    new Apiresponse(201, newmessage, "Message sent successfully")
  );
});


// =========================
// EXPORT
// =========================
export { getusersforsidebar, getMessages, sendmessage };
