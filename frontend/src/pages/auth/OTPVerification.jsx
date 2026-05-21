import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTPThunk, resendOTPThunk, clearError, setRoleThunk } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, otpPending, userId, email, user, requiresRoleSelection } = useSelector(
    (state) => state.auth
  );

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  // Redirect if not in OTP verification flow
  useEffect(() => {
    if ((!otpPending || !userId) && !requiresRoleSelection) {
      navigate("/login");
    }
  }, [otpPending, userId, requiresRoleSelection, navigate]);

  // Redirect if login successful
  useEffect(() => {
    if (user && !requiresRoleSelection) {
      if (user.role === "admin") {
        navigate("/");
      } else if (user.role === "user") {
        navigate("/");
      } else if (user.role === "seller") {
        navigate("/");
      }
    }
  }, [user, requiresRoleSelection, navigate]);

  
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleOTPChange = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && value.length <= 4)) {
      setOtp(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length !== 4) {
      return;
    }

    dispatch(
      verifyOTPThunk({
        userId,
        otp,
      })
    );
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      await dispatch(resendOTPThunk(userId)).unwrap();
      setTimer(600);
      setCanResend(false);
      setOtp("");
    } catch (err) {
      // Error is already in state
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRole) {
      return;
    }

    dispatch(
      setRoleThunk({
        userId: user._id,
        role: selectedRole,
      })
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#211c24] p-5">
      <div className="w-full max-w-md bg-[#EDEDED] rounded-2xl p-8 shadow-xl">
        
        {requiresRoleSelection ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">Select Your Role</h2>
            <p className="text-gray-600 text-center mb-6">
              Please select your role to continue
            </p>

            {/* Error Message */}
            {error && (
              <p className="bg-red-100 text-red-500 p-3 rounded-lg mb-5 text-sm">
                {error}
              </p>
            )}

            <form onSubmit={handleRoleSubmit} className="flex flex-col gap-5">
              {/* Role Selection */}
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition" >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedRole === "user"}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-gray-800">User</span>
                  <span className="text-sm text-gray-500 ml-auto">Browse and purchase products</span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={selectedRole === "seller"}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span className="text-lg font-semibold text-gray-800">Seller</span>
                  <span className="text-sm text-gray-500 ml-auto">Sell your products</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedRole || loading}
                className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                  selectedRole && !loading
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Setting role..." : "Continue"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-2">Verify OTP</h2>
            <p className="text-gray-600 text-center mb-6">
              We've sent a 4-digit OTP to<br />
              <span className="font-semibold">{email}</span>
            </p>

            {/* Error Message */}
            {error && (
              <p className="bg-red-100 text-red-500 p-3 rounded-lg mb-5 text-sm">
                {error}
              </p>
            )}

            {/* Success Message */}
            {!error && !loading && !otpPending && (
              <p className="bg-green-100 text-green-500 p-3 rounded-lg mb-5 text-sm">
                OTP verified successfully! Please select your role.
              </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* OTP Input */}
              <div className="flex flex-col">
                <label className="text-md font-semibold text-gray-800 mb-2">
                  Enter OTP*
                </label>
                <input
                  type="text"
                  placeholder="0000"
                  value={otp}
                  onChange={handleOTPChange}
                  maxLength="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest font-bold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {otp.length}/4 digits entered
                </p>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <span className="text-sm text-gray-700">
                  OTP expires in: <span className="font-bold">{formatTime(timer)}</span>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={otp.length !== 4 || loading}
                className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                  otp.length === 4 && !loading
                    ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the OTP?</p>
              <button
                onClick={handleResendOTP}
                disabled={!canResend || resendLoading}
                className={`text-sm font-semibold transition duration-200 ${
                  canResend && !resendLoading
                    ? "text-blue-500 hover:text-blue-700 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {resendLoading ? "Sending..." : canResend ? "Resend OTP" : `Resend in ${formatTime(timer)}`}
              </button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-500 text-center mt-6">
              Your OTP is valid for 10 minutes. Make sure to check your spam folder if you don't see the email.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
