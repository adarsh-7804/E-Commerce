import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import cart from './assets/cart.svg'
import heroImg from './assets/hero.png'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import OTPVerification from './pages/auth/OTPVerification'
import Cart from './pages/Cart'
import AddProduct from './components/seller/AddProduct'
import SingleProduct from './components/products/SingleProduct'
// import './App.css'
import Profile from './pages/Profile'
import Footer from './components/layout/Footer'
import AddressAdding from './pages/AddressAdding'
import Shipping from './pages/Shipping'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailure from './pages/PaymentFailure'
import SetPassword from './pages/auth/SetPassword'
import ForgotPassword from './pages/auth/ForgotPassword'

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
    <Navbar />

    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/products/:id" element={<SingleProduct />} />
      <Route path='/profile' element={ <Profile /> } />
      <Route path="/cart" element={< Cart />} />
      <Route path="/login" element={<Login /> } />
      <Route path="/otp-verification" element={<OTPVerification /> } />
      <Route path="/register" element={<Register /> } />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/add-product/:id" element={<AddProduct />} />
      <Route path="/add-address" element={<AddressAdding />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failure" element={<PaymentFailure />} />
      <Route path="/set-password" element={<SetPassword />} />
    </Routes>

    <Footer />
    </>
  )
}

export default App  
