import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://real-time-chat-application-bice.vercel.app",
      "https://devgroup-xjzm.onrender.com",
    ],
    credentials: true,
  },
  transports: ["polling", "websocket"],
  path: "/socket.io",   // ✔️ FIXED — NO TRAILING SLASH
});


const usersocketMap = {};

export function getReceiverSocketId(userId) {
  return usersocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    usersocketMap[userId] = socket.id;
  }

  io.emit("getonlineUsers", Object.keys(usersocketMap));

  socket.on("disconnect", () => {
    delete usersocketMap[userId];
    console.log("❌ User disconnected:", socket.id);
  });
});

export { app, server, io };
