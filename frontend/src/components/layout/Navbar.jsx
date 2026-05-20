import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { getCartThunk, clearCartState } from "../../features/cart/cartSlice";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((s) => s.cart) 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch cart when user logs in
  useEffect(() => {
    if (user && user.token) {
      dispatch(getCartThunk());
    }
  }, [user, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCartState());
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 bg-black text-white px-8 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide"
      >
        ShopSphere
      </Link>

      <div className="flex items-center gap-6 text-lg">
        {/* <Link to="/">Home</Link> */}

        <Link to="/cart" className="relative flex gap-0.5">
          <FaShoppingCart size={26} /> <span className="absolute flex justify-center items-center text-[10px] 
          
          text-black left-[13px] top-[3px] font-bold rounded-full ">{totalItems}</span>
          {/* h-[12px] bg-white w-[12px] */}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <img src="https://i.pinimg.com/736x/7f/ff/68/7fff6829e61d1924c44d8cb5a0cfbdff.jpg" alt="Profile" className="w-7 h-7 rounded-full" />
            {user && <span className="text-sm">{user.name || user.email}</span>}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-50">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="font-semibold text-sm">{user.name || user.email}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Link
                    to="/Profile"
                    className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/user/orders"
                    className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm border-t border-gray-700 text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-700 text-sm"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 hover:bg-gray-700 text-sm border-t border-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;