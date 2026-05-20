import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setPasswordAPI } from '../../services/authService'

const SetPassword = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token")

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (!token) {
            setPasswordError("Invalid or missing password setup link. Please register again.");
        }
    }, [token]);

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setPasswordError("");
        setSuccessMessage("");

        if (!formData.password || !formData.confirmPassword) {
            setPasswordError("Both password fields are required.");
            return;
        }

        if (!validatePassword(formData.password)) {
            setPasswordError(
                "Password must contain uppercase, lowercase, number, special character and minimum 8 characters."
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            const response = await setPasswordAPI({
                token,
                password: formData.password,
            });

            setSuccessMessage(response.message || "Password set successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setPasswordError(
                error.response?.data?.message || "Failed to set password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <div className="w-full min-h-screen bg-[#211c24] flex items-center justify-center p-5">
                <div className="w-full max-w-md bg-[#EDEDED] rounded-2xl p-8 shadow-xl text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-600">Invalid Link</h2>
                    <p className="text-gray-700 mb-6">{passwordError}</p>
                    <a
                        href="/register"
                        className="bg-[#000000] text-white p-3 rounded-lg hover:bg-[#333333] transition inline-block"
                    >
                        Go Back to Register
                    </a>
                </div>
            </div>
        );
    }

    return (
         <div className="w-full min-h-screen bg-[#211c24] flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-[#EDEDED] rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Set Your Password</h2>
        <p className="text-center text-gray-600 mb-6">Complete your registration by setting a secure password</p>

        {passwordError && (
          <p className="text-red-500 text-center mb-4 border border-red-500 p-3 rounded-lg bg-red-100">
            {passwordError}
          </p>
        )}

        {successMessage && (
          <p className="text-green-600 text-center mb-4 border border-green-500 p-3 rounded-lg bg-green-100">
            {successMessage}
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Must contain: uppercase, lowercase, number, special character, min 8 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Confirm Password*
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-[#000000] text-white rounded-lg hover:bg-[#333333] transition duration-300 cursor-pointer disabled:opacity-50 font-semibold"
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          <a href="/login" className="text-blue-600 hover:underline font-semibold">
            Back to Login
          </a>
        </p>
      </div>
    </div>
    )
}

export default SetPassword
