import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import router from './router/user_router.js';
import messagerouter from './router/message_route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app, server } from './utils/socket.js';
import path from "path";

dotenv.config();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://real-time-chat-application-bice.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// REQUIRED FOR SOCKET.IO on Render
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// IMPORTANT: SOCKET.IO PUBLIC PATH
app.get("/socket.io/", (req, res) => {
  res.send("Socket server active");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", router);
app.use("/api/message", messagerouter);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
