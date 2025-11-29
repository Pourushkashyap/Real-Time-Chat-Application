import {create} from 'zustand'
import { axiosInstance } from '../utils/axios.js'
import toast from 'react-hot-toast'
import {io} from "socket.io-client"

const BASE_URL =
  import.meta.env.VITE_MODE === "development"
    ? "http://localhost:5000"
    : "https://devgroup-xjzm.onrender.com";


export const useAuthStore = create((set,get) =>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,

    checkAuth: async() =>{
        try{
            const res = await axiosInstance.get('/user/me')
            console.log(res.data)
            // console.log(res.data.user)
            set({authUser: res.data.user})
        }
        catch(err){
            console.log("Error in Checkauth:",err)
            set({authUser: null})
        }
        finally{
            set({isCheckingAuth: false})
        }
    },

    signup: async(data) =>{
       set({isSigningUp:true});
       try{
        const res = await axiosInstance.post("/user/register",data)
        set({authUser:res.data.user})
        toast.success("Account created Successfully")
          await useAuthStore.getState().checkAuth();
          get().connectSocket();
       }
       catch(err){
           toast.error(err.response?.data?.message || "Signup failed")
       }
       finally{
        set({isSigningUp:false})
       }
    },

    LogIn : async(data) =>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post("/user/login",data);
            set({authUser: res.data.user});
            toast.success("Login successfully")
            
            await useAuthStore.getState().checkAuth();
            await get().connectSocket();
             
        }
        catch(err){
            toast.error(err.response?.data?.message || "Login failed")
        }
         finally{
        set({isLoggingIn:false})
       }
    },
    logout: async() =>{
        try{
            await axiosInstance.post("/user/logout");
            set({authUser:null})
            get().disconnectsocket();
            toast.success("Logged out successfully")
            
        }
        catch(error){
            toast.error(error.response?.data?.message);
        }
    },
    updateprofile: async(data) =>{

       set({isUpdatingProfile:true})
       try{
           const res = await axiosInstance.put("/user/updateprofile",data);
           set({authUser:res.data.user});
           toast.success("Profile updated successfully")
       }
       catch(err){
        toast.error(err.response?.data?.message)
       }
       finally{
          set({isUpdatingProfile:false});
       }

    },
    connectSocket: () => {
  const { authUser, socket } = get();
  if (!authUser || socket?.connected) return;

  console.log("Connecting socket for:", authUser._id);

  const newsocket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],   // ❤️ FIX
  path: "/socket.io",
  query: {
    userId: authUser._id,
  },
});


  newsocket.on("connect", () => {
    console.log("🔥 Socket connected:", newsocket.id);
  });

  newsocket.on("connect_error", (err) => {
    console.log("❌ Socket connect error:", err.message);
  });

  newsocket.on("getonlineUsers", (userIds) => {
    console.log("userIds:", userIds);
    set({ onlineUsers: userIds });
  });

  set({ socket: newsocket });
},

    disconnectsocket : () =>{
        
        if(get().socket?.connected) get().socket.disconnect();
        
    }

}))



