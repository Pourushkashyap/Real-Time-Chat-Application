import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { MessageSquare, User, Mail, Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import AuthImagePattern from "../component/AuthImagePattern.jsx"
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
function Signup() {
  const [showpassword, setshowpassword] = useState(false)
  const [formdata, setformdata] = useState({
    username:"",
    email:"",
    password:""
  });

  const navigate = useNavigate();
  

  const [islogin,setislogin] = useState(false);

  const {signup, isSigningUp, LogIn,isLoggingIn, authUser , checkAuth} = useAuthStore()


  useEffect(() => {
    if (authUser) {
      navigate("/");    // ✅ auto redirect after login/signup
    }
  }, [authUser, navigate]);
  
  const validateform = () =>{
    if(!formdata.username.trim()) return toast.error("Full name is required")
    if(!formdata.email.trim()) return toast.error("Email is required");
     if (!/\S+@\S+\.\S+/.test(formdata.email)) return toast.error("Invalid email format");
    if (!formdata.password) return toast.error("Password is required");
    if (formdata.password.length < 6) return toast.error("Password must be at least 6 characters");  

    return true;
  }

  const validateform2 = () =>{
      if(!formdata.email.trim()) return toast.error("Email is required");
     if (!/\S+@\S+\.\S+/.test(formdata.email)) return toast.error("Invalid email format");
    if (!formdata.password) return toast.error("Password is required");
    if (formdata.password.length < 6) return toast.error("Password must be at least 6 characters");  

    return true;

  }

  const handlesubmit = (e) =>{
    e.preventDefault()

     if(!islogin){
      const success = validateform();

    if(success === true) { 
      signup(formdata)
    

    };
     }
     else{
      const success = validateform2();
      if(success === true){
         LogIn(formdata);
        
      }
     }
  }

return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handlesubmit} className="space-y-6">
            
            {!islogin && (
               <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formdata.username}
                  onChange={(e) => setformdata({ ...formdata, username: e.target.value })}

                />
              </div>
            </div>
            )}

           

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formdata.email}
                  onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type={showpassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formdata.password}
                  onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setshowpassword(!showpassword)}
                >
                  {showpassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

             {!islogin && (
                <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
             )}
             {islogin && (
                 <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>

             )}
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
             {!islogin ? " Already have an account" :" Don&apos;t have an account" }  ?{" "}
              <Link onClick={() =>setislogin(!islogin)}  className="link link-primary">
               {islogin ? "Create account" :  "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};
export default Signup