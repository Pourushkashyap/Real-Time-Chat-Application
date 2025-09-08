import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';;
import router from './router/user_router.js';
import messagerouter from './router/message_route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { app,io,server } from './utils/socket.js';



dotenv.config();

console.log(process.env.PORT);
const port = process.env.PORT;


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



app.use("/api/user",router);
app.use("/api/message",messagerouter)




connectDB()
.then(() =>
    server.listen(port, () => {
    console.log(`app is listen on port ${port}`);
})
)
.catch((err) => {
    console.log("Error connecting to the database: ", err);
});