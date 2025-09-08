import Navbar from './component/Navbar.jsx'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js'
import { useEffect } from 'react'
import { Toaster } from "react-hot-toast"
import { Loader } from "lucide-react"   
import HomePage from './component/HomePage.jsx'
import Signup from './component/Signup.jsx'
import Setting from './component/Setting.jsx'
import Profile from './component/Profile.jsx'
import { useThemeStore } from './store/useThemeStore.js'


function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore()
  const {theme} = useThemeStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log(onlineUsers);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      <div data-theme={theme}>
        <Navbar />

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/signup" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/signup" />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
