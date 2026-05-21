import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { googleLoginSuccess, loginUserThunk } from '../../features/auth/authSlice'

const GoogleLoginButton = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Credential Response:', credentialResponse);

      const res = await axios.post(
        'http://localhost:5000/api/auth/google',
        { idToken: credentialResponse.credential }
      );

      if (res.data.token) {

        localStorage.setItem('token', res.data.token);

        localStorage.setItem("user", JSON.stringify(res.data));

      }


      dispatch(
        googleLoginSuccess({
          user: res.data.user,
          requiresRoleSelection: res.data.requiresRoleSelection,
        })
      );

      if (res.data.requiresRoleSelection) {
        navigate("/otp-verification");
      } else {
        navigate("/");
      }


    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleGoogleError = () => {
    console.log('Login Failed');
    alert('Google login failed');
  };

  return (
    <div className="w-full mt-4 flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        width="300"
      />
    </div>
  )
}

export default GoogleLoginButton
