import mongoose from 'mongoose';

export const connectDB = async () =>{
    try{
        const connect = mongoose.connect(process.env.MONGODB_URI);
        console.log("mongodb connected");
    }
    catch(err){
        console.log("Mongo connection failed: ",err);
    }
}