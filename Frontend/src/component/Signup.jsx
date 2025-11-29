import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import AuthImagePattern from "../component/AuthImagePattern.jsx";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ---------- React Icons ----------
import { IoIosChatboxes } from "react-icons/io";
import { CiLock, CiMail } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa6";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Signup() {
  const [showpassword, setshowpassword] = useState(false);
  const [islogin, setislogin] = useState(false);

  const [formdata, setformdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { signup, isSigningUp, LogIn, isLoggingIn, authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  const validateform = () => {
    if (!formdata.username.trim()) return toast.error("Full name is required");
    if (!formdata.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formdata.email))
      return toast.error("Invalid email format");
    if (!formdata.password) return toast.error("Password is required");
    if (formdata.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const validateform2 = () => {
    if (!formdata.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formdata.email))
      return toast.error("Invalid email format");
    if (!formdata.password) return toast.error("Password is required");
    if (formdata.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handlesubmit = (e) => {
    e.preventDefault();

    if (!islogin) {
      if (validateform()) signup(formdata);
    } else {
      if (validateform2()) LogIn(formdata);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <IoIosChatboxes className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">
                {islogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-base-content/60">
                {islogin
                  ? "Welcome back! Sign in to continue"
                  : "Get started with your free account"}
              </p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handlesubmit} className="space-y-6">
            {/* Full Name */}
            {!islogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>

                <div className="relative">
                  {/* FIXED ICON */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-3 bg-base-100 px-1 rounded z-10">
  <FaRegUser className="w-5 h-5 text-base-content/70" />
</div>


                  <input
                    type="text"
                    className="input input-bordered w-full pl-12"
                    placeholder="John Doe"
                    value={formdata.username}
                    onChange={(e) =>
                      setformdata({ ...formdata, username: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <div className="relative">
                {/* FIXED ICON */}
                <div className="absolute top-1/2 -translate-y-1/2 left-3 bg-base-100 px-1 rounded z-10">
                  <CiMail className="w-5 h-5 text-base-content/70" />
                </div>

                <input
                  type="email"
                  className="input input-bordered w-full pl-12"
                  placeholder="you@example.com"
                  value={formdata.email}
                  onChange={(e) =>
                    setformdata({ ...formdata, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>

              <div className="relative">
                {/* FIXED ICON LEFT */}
                <div className="absolute top-1/2 -translate-y-1/2 left-3 bg-base-100 px-1 rounded z-10">
                  <CiLock className="w-5 h-5 text-base-content/70" />
                </div>

                <input
                  type={showpassword ? "text" : "password"}
                  className="input input-bordered w-full pl-12 pr-14"
                  placeholder="••••••••"
                  value={formdata.password}
                  onChange={(e) =>
                    setformdata({ ...formdata, password: e.target.value })
                  }
                />

                {/* FIXED ICON RIGHT */}
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 z-10"
                  onClick={() => setshowpassword(!showpassword)}
                >
                  {showpassword ? (
                    <IoEye className="w-5 h-5 text-base-content/70" />
                  ) : (
                    < IoEyeOff className="w-5 h-5 text-base-content/70" />
                  )}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            {!islogin ? (
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <AiOutlineLoading3Quarters className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <AiOutlineLoading3Quarters className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            )}
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              {islogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <Link
                onClick={() => setislogin(!islogin)}
                className="link link-primary"
              >
                {islogin ? "Create account" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}

export default Signup;
