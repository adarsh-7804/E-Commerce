const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateOTP, getOTPExpiry, sendOTPEmail, verifyOTP, sendPasswordSetupEmail } = require("../utils/otpService");

const registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                message: "This email is already registered"
            });
        }

        // Create user without password and role (will be set on first login)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: null,
            isPasswordSet: false,
            role: null,
            isRoleSet: false,
        });

        // Generating token for password 
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiry = tokenExpiry;
        await user.save();

        // Send password setup email
        try {
            await sendPasswordSetupEmail(email, resetToken, user.name);
        } catch (emailError) {
            console.error("Failed to send password setup email:", emailError);
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                message: "Registration failed. Unable to send password setup email. Please try again."
            });
        }

        res.status(201).json({
            message: "Registration initiated! Check your email to set your password.",
            userId: user._id,
            email: user.email
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: err.message });
    }
}

// This function is called from routes when user explicitly requests password setup email resend
const sendPasswordSetupEmailController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        if (user.isPasswordSet) {
            return res.status(400).json({
                message: "Password is already set for this account. Please login."
            })
        }

        // Generate new password reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiry = tokenExpiry;
        await user.save();

        try {
            await sendPasswordSetupEmail(email, resetToken, user.name);
        } catch (err) {
            console.error("Failed to send password setup email:", err);
            return res.status(500).json({
                message: "Failed to send password setup email. Please try again."
            });
        }

        res.status(200).json({
            message: "Password setup email sent successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });

    }
}

const verifyPasswordToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Token is required"
            });
        }

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired password setup link"
            });
        }

        res.status(200).json({
            message: "Token is valid",
            userId: user._id,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Set Password with Token
const setPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and password are required"
            });
        }

        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired password setup link"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user
        user.password = hashedPassword;
        user.isPasswordSet = true;
        user.passwordResetToken = null;
        user.passwordResetTokenExpiry = null;
        await user.save();

        res.status(200).json({
            message: "Password set successfully! You can now login.",
            userId: user._id,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Login - Send OTP
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();

        // Save OTP to database
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.isOtpVerified = false;
        await user.save();

        // Send OTP via email
        try {
            await sendOTPEmail(email, otp, user.name);
        } catch (emailError) {
            console.error("Failed to send OTP:", emailError);
            return res.status(500).json({
                message: "Failed to send OTP email. Please check your email configuration.",
                error: emailError.message
            });
        }

        res.status(200).json({
            message: "OTP sent to your email",
            userId: user._id,
            email: user.email,
            name: user.name,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: err.message });
    }
}

// Verify OTP
const verifyOTPCode = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({
                message: "User ID and OTP are required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Verify OTP
        const otpVerification = verifyOTP(user.otp, otp, user.otpExpiry);

        if (!otpVerification.valid) {
            return res.status(400).json({
                message: otpVerification.message
            });
        }

        // Clear OTP
        user.otp = null;
        user.otpExpiry = null;
        user.isOtpVerified = true;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Check if role is set
        if (!user.isRoleSet) {
            return res.status(200).json({
                message: "Please select your role to continue",
                _id: user._id,
                email: user.email,
                name: user.name,
                requiresRoleSelection: true,
                token,
            });
        }

        res.status(200).json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = getOTPExpiry();

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        try {
            await sendOTPEmail(user.email, otp, user.name);
        } catch (emailError) {
            console.error("Failed to resend OTP:", emailError);
            return res.status(500).json({
                message: "Failed to resend OTP email. Please check your email configuration.",
                error: emailError.message
            });
        }

        res.status(200).json({
            message: "OTP resent to your email"
        });

    } catch (err) {
        console.error("Resend OTP error:", err);
        res.status(500).json({ message: err.message });
    }
}

const setRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!userId || !role) {
            return res.status(400).json({
                message: "User ID and role are required"
            });
        }

        if (!['user', 'seller'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be 'user' or 'seller'"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            {
                role: role,
                isRoleSet: true
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Role set successfully! You can now access the platform.",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Forgot Password - Send password reset email
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                message: "No account found with this email address"
            });
        }

        if (!user.isPasswordSet) {
            return res.status(400).json({
                message: "This account hasn't completed registration yet. Please check your registration email or contact support."
            });
        }

        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        user.passwordResetToken = resetToken;
        user.passwordResetTokenExpiry = tokenExpiry;
        await user.save();

        // Send password reset email
        try {
            await sendPasswordSetupEmail(email, resetToken, user.name);
        } catch (err) {
            console.error("Failed to send password reset email:", err);
            return res.status(500).json({
                message: "Failed to send password reset email. Please try again."
            });
        }

        res.status(200).json({
            message: "Password reset link sent to your email. It will expire in 24 hours."
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    registerUser,
    sendPasswordSetupEmailController,
    verifyPasswordToken,
    setPassword,
    loginUser,
    verifyOTPCode,
    resendOTP,
    setRole,
    logoutUser,
    forgotPassword
}