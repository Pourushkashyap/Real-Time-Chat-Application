import React from 'react'
import { Loader } from 'lucide-react'
import { usechatstore } from '../store/usechatStore'
import Sidebar from './Sidebar.jsx';
import ChatContainer from './ChatContainer.jsx';
import NoChatSelected from './NoChatSelected.jsx';
function HomePage() {
    const {selectedUser} = usechatstore(); 
         

  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage