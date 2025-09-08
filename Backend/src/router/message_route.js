import express from 'express';
import { verifyjwt } from '../middleware/verifyjwt.js';
import {getusersforsidebar,getMessages, sendmessage} from '../controller/message_controller.js';
import { upload } from '../middleware/multer_middleware.js';
const router = express.Router();

router.get("/users",verifyjwt,getusersforsidebar);

router.get("/:id",verifyjwt,getMessages);

router.post("/send/:id",upload.single("image"),verifyjwt,sendmessage);  



export default router;