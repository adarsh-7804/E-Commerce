const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetTokenExpiry: {
      type: Date,
      default: null,
    },

    isPasswordSet: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: null,
    },

    isRoleSet: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },
    googleId: { type: String, unique: true, sparse: true },
    profilePic: String,

    otpExpiry: {
      type: Date,
      default: null,
    },

    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);