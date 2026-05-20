const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Calculate OTP expiry time (10 minutes from now)
const getOTPExpiry = () => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10);
  return expiryTime;
};


const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const getPasswordResetTokenExpiry = () => {
  const expiryTime = new Date();
  expiryTime.setHours(expiryTime.getHours() + 24);
  return expiryTime;
};

const sendPasswordSetupEmail = async (email, token, name) => {
  try {
    const passwordSetupLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/set-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Set Your Password - Registration Complete",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our E-Commerce Platform!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with us. Please complete your registration by setting a secure password.</p>
          
          <div style="margin: 30px 0;">
            <a href="${passwordSetupLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Set Your Password
            </a>
          </div>

          <p style="color: #666;">Or copy and paste this link in your browser:</p>
          <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
            ${passwordSetupLink}
          </p>

          <p style="color: #666;">
            <strong>This link will expire in 24 hours.</strong>
          </p>

          <p style="color: #666;">
            If you didn't request this email, please ignore it or contact our support team.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            © 2026 E-Commerce Platform. All rights reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password setup email sent successfully:", info.response);
    
    return { 
      success: true, 
      message: "Password setup email sent successfully"
    };
  } catch (error) {
    console.error("Password setup email sending error:", error.message || error);
    throw new Error(`Failed to send password setup email: ${error.message}`);
  }
};


// Configure Email Transporter with better settings
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email Transporter Error:", error);
  } else {
    console.log("Email Transporter Ready:", success);
  }
});

// Send OTP via Email
const sendOTPEmail = async (email, otp, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Login Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Login Verification</h2>
          <p>Hi ${name},</p>
          <p>Your OTP for login verification is:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #007bff; text-align: center; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">
            <strong>This OTP will expire in 10 minutes.</strong>
          </p>
          <p style="color: #666;">
            If you didn't request this OTP, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            © 2026 E-Commerce Platform. All rights reserved.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error.message || error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// Verify OTP
const verifyOTP = (storedOTP, providedOTP, expiryTime) => {
  if (!storedOTP || !providedOTP) {
    return { valid: false, message: "OTP is missing" };
  }

  if (new Date() > expiryTime) {
    return { valid: false, message: "OTP has expired" };
  }

  if (storedOTP !== providedOTP) {
    return { valid: false, message: "Invalid OTP" };
  }

  return { valid: true, message: "OTP verified successfully" };
};

module.exports = {
  generateOTP,
  getOTPExpiry,
  sendOTPEmail,
  verifyOTP,
  generatePasswordResetToken,
  getPasswordResetTokenExpiry,
  sendPasswordSetupEmail
};
