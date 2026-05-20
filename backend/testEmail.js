// Test Email Configuration
// Run this file to test if email sending works: node testEmail.js

require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Email Configuration...');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '****' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('\n❌ Email Configuration Error:');
    console.error(error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check if EMAIL_USER and EMAIL_PASSWORD are correct in .env');
    console.log('2. Make sure the app password has no extra spaces');
    console.log('3. Verify 2-Step Verification is enabled in Gmail');
    console.log('4. Check if Gmail account has "Less Secure Apps" access enabled');
  } else {
    console.log('\n✅ Email Configuration is Working!');
    console.log('Connection successful:', success);
    
    // Send test email
    const testMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to same email to test
      subject: 'OTP Test Email',
      html: '<h1>1234</h1><p>This is a test OTP email.</p>'
    };

    transporter.sendMail(testMail, (error, info) => {
      if (error) {
        console.error('\n❌ Failed to send test email:');
        console.error(error.message);
      } else {
        console.log('\n✅ Test email sent successfully!');
        console.log('Response:', info.response);
      }
      process.exit(0);
    });
  }
});
