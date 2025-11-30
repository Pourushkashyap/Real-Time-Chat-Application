import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import router from './router/user_router.js';
import messagerouter from './router/message_route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app, io, server } from './utils/socket.js';
import path from "path";

dotenv.config();
const __dirname = path.resolve();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://real-time-chat-application-bice.vercel.app",
      "https://devgroup-xjzm.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ❌ REMOVE THIS — THIS IS THE BUG
// app.options("/*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/user", router);
app.use("/api/message", messagerouter);

connectDB()
  .then(() =>
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    })
  )
  .catch((err) => {
    console.log("Database connection error:", err);
  });
