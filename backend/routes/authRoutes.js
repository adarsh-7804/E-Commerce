const express = require('express');

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyOTPCode,
    resendOTP,
    logoutUser,
    sendPasswordSetupEmailController,
    verifyPasswordToken,
    setPassword,
    setRole,
    forgotPassword
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTPCode);
router.post('/resend-otp', resendOTP);
router.post('/set-role', setRole);
router.post('/logout', logoutUser);
router.post("/send-password-setup", sendPasswordSetupEmailController);
router.post("/forgot-password", forgotPassword);
router.post("/verify-password-token", verifyPasswordToken);
router.post("/set-password", setPassword);

module.exports = router;