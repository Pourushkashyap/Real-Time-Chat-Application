import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://real-time-chat-application-bice.vercel.app",    // Vercel frontend
      "https://devgroup-xjzm.onrender.com"                     // Backend domain
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
  path: "/socket.io"
});


const usersocketMap = {};

export function getReceiverSocketId(userId){
    return usersocketMap[userId];
}

io.on("connection",(socket) =>{
    console.log("user connected",socket.id);

    const userId = socket.handshake.query.userId;
    if(userId){
        usersocketMap[userId] = socket.id
    }
    console.log("ides are: ",Object.keys(usersocketMap))

    io.emit("getonlineUsers",Object.keys(usersocketMap))

    socket.on("disconnect",() =>{
    console.log("A user disconnected",socket.id)
    delete usersocketMap[userId];
})

})


export {io, app, server} 