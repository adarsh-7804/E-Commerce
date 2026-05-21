import React, { useEffect, useState } from "react";
import login from "../../assets/login.png";

import { useDispatch, useSelector } from "react-redux";
import { loginUserThunk, clearError } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, otpPending } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUserThunk(formData));
  }

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (otpPending) {
      navigate("/otp-verification");
    }
  }, [otpPending, navigate]);

  useEffect(() => {
    if (user) {

      if (user.role === "admin") {
        navigate("/");
      }

      else if (user.role === "user") {
        navigate("/");
      }

      else if (user.role === "seller") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex">

      {/* Left side Image */}
      <div className="hidden lg:flex w-[45vw] bg-black items-center justify-center">
        <img
          src={login}
          alt="login"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side Form */}
      <div className="w-full   lg:w-[55vw] min-h-screen bg-[#211c24] flex items-center  justify-center p-5">

        <div className="w-full   mt-[7vw] max-w-md bg-[#EDEDED] rounded-2xl p-8 shadow-xl flex flex-col items-center justify-center">

          <h2 className="text-3xl font-bold text-center mb-8">
            Login
          </h2>

          {/* Error Message */}
          {
            error && (
              <p className="bg-red-100 text-red-500 p-3 rounded-lg mb-5 text-sm">
                {error}
              </p>
            )
          }


          <form className="w-full flex flex-col "
            onSubmit={handleSubmit}
          >
            <span className="text-md text-black-500 mb-4">
              Email*
            </span>
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mb-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <span className="text-md text-black-500 mb-4">
              Password*
            </span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <p className="mb-5 text-right">
              <Link
                to="/forgot-password"
                className="text-[#1580c3] underline text-sm"
              >
                Forgot Password?
              </Link>
            </p>

            <button
              type="submit"
              // onClick={handleSubmit}
              className="w-full p-3 bg-[#000000] text-white   rounded-lg hover:bg-[#333333] transition duration-300 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login "}
            </button>

            <GoogleLoginButton />

          </form>



          <p className="text-center mt-5">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#1580c3] underline"
            >
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;