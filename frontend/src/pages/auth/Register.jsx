import React, { useState, useEffect } from "react";
import register from "../../assets/register.png";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk, clearError } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";


const Register = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { loading, error, user } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    setEmailError("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!formData.name.trim()) {
      setEmailError("Name is required.");
      return;
    }
    
    dispatch(registerUserThunk(formData));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setSuccessMessage("Registration initiated! Check your email to set your password.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex">

      {/* Left side Image */}
      <div className="hidden lg:flex w-[45vw] h-screen bg-black items-center justify-center">
        <img
          src={register}
          alt="Register"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side Form */}
      <div className="w-full lg:w-[55vw] min-h-screen bg-[#211c24] flex items-center justify-center p-5">

        <div className="w-full max-w-md h-[60vh] -mt-[6vw]  bg-[#EDEDED] rounded-2xl p-8 shadow-xl">

          <h2 className="text-3xl font-bold text-center my-8">
            Register
          </h2>

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

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <span className="text-md text-black-500">
              Name*
            </span>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            
            <span className="text-md text-black-500">
              Email*
            </span>
            <input
              type="text"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            {
              emailError && (
                <p className="text-red-500 text-sm -mt-2">
                  {emailError}
                </p>
              )
            }

            <button
              type="submit"
              className="w-full p-3 bg-[#000000] text-white   rounded-lg hover:bg-[#333333] transition duration-300 cursor-pointer"
            >
              {loading ? "Registering..." : "Register"}
            </button>



          </form>

          <p className="text-center mt-5">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#1580c3] underline"
            >
              Login
            </a>
          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;