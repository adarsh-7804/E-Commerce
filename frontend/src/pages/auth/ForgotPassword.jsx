import React, { useState } from "react";
import login from "../../assets/login.png";
import { Link } from "react-router-dom";
import { forgotPasswordAPI } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await forgotPasswordAPI(email);

      setSuccessMessage(response.message);
      setEmail("");
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex">
      {/* Left side Image */}
      <div className="hidden lg:flex w-[45vw] h-screen bg-black items-center justify-center">
        <img
          src={login}
          alt="Forgot Password"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side Form */}
      <div className="w-full lg:w-[55vw] min-h-screen bg-[#211c24] flex items-center justify-center p-5">
        <div className="w-full max-w-md h-auto bg-[#EDEDED] rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <p className="text-red-500 text-center mb-4 border border-red-500 p-2 rounded-lg bg-red-100">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="text-green-600 text-center mb-4 border border-green-500 p-2 rounded-lg bg-green-100">
              {successMessage}
            </p>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <span className="text-md text-black-500">Email*</span>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <button
              type="submit"
              className="w-full p-3 bg-[#000000] text-white rounded-lg hover:bg-[#333333] transition duration-300 cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="text-center mt-5">
            Remember your password?{" "}
            <Link to="/login" className="text-[#1580c3] underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
