import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios"; 
import { useAuthStore } from "./useAuthStore";
export const usechatstore = create((set,get) => ({
    messages: [],
    users: [], 
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    onlineUsers: [],

    getUser: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data.data });   // ✅ fixed here
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            const msgs = res.data.data;
            console.log("message is:",res)
            set({ messages: Array.isArray(msgs) ? msgs : [] }); 

        } catch (error) {
            console.error(error);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessages : async (messagedata) =>{
       
       const {selectedUser, messages} = get();
       try{
        const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messagedata)
        set({messages:[...messages,res.data.data]})
       }
       catch (error) {
       toast.error(error.response?.data?.message || "Failed to send message");
      }


    },

    subscribetoMessages : () =>{
       const {selectedUser} = get();
       if(!selectedUser) return ;
        const socket = useAuthStore.getState().socket

        socket.on("newMessage",(newMessage) =>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if(!isMessageSentFromSelectedUser) return;
            set({
                messages : [...get().messages,newMessage],
            })
        })

    },


    unsubscribetoMessages:() =>{
       const socket = useAuthStore.getState().socket;
       socket.off("newMessage");
    },

    setselectedUser: (selectedUser) => set({ selectedUser })
}));
