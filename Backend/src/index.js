import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import router from "./router/user_router.js";
import messagerouter from "./router/message_route.js";
import { app, server } from "./utils/socket.js";

dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://real-time-chat-application-bice.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", router);
app.use("/api/message", messagerouter);

connectDB().then(() => {
  server.listen(port, () => console.log("Server started on", port));
});
