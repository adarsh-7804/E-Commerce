// import React from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import AddProduct from "../components/seller/AddProduct";
// // import Profile from './Profile';

// const Profile = () => {
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const isSeller = user?.role === "seller";

//   return (
//     <div className="px-2.5 mt-3">
//       <h1 className="font-bold text-2xl">My Profile</h1>
//       <p className="text-sm text-gray-400 my-1.5">
//         View and manage your profile information
//       </p>
//       <div className="border border-gray-300 rounded p-4 ">
//         <div className="flex gap-4">
//           <div className="w-[15vw] h-[15vw] rounded-full bg-green-300 overflow-hidden">
//             <img src="https://i.pinimg.com/736x/7f/ff/68/7fff6829e61d1924c44d8cb5a0cfbdff.jpg" />
//           </div>
//           <div>
//             <h1> {user?.name} </h1>
//             <p className=" w-[45px] pl-[5px]    text-[#3A9743] bg-[#E3F7E7] rounde-md overflow-auto"> {user?.role} </p>
//           </div>

//         </div>
//         <p>Email: {user?.email}</p>
//         <p>Role: {user?.role}</p>
//       </div>

//       {isSeller && (
//         <button
//           className=""
//           onClick={() => {
//             navigate("/seller/add-product");
//           }}
//         >
//           + Add Product
//         </button>
//       )}

//       {/* {isSeller && <AddProduct />} */}
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FiMail, FiUser, FiCalendar, FiPlus, FiChevronRight,
  FiLock, FiShield, FiLogOut, FiEdit2, FiArrowLeft
} from "react-icons/fi";
import { logout } from "../features/auth/authSlice";
import { getSellerProductsThunk, clearProductState } from "../features/products/productSlice";
import SellerProductCard from "../components/products/SellerProductCard";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { products: sellerProducts, loading: productsLoading, error: productsError, success } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showProducts, setShowProducts] = useState(false);

  const isSeller = user?.role === "seller";

  // Fetch seller products when component mounts or when isSeller changes
  useEffect(() => {
    if (isSeller && showProducts) {
      dispatch(getSellerProductsThunk());
    }
  }, [isSeller, showProducts, dispatch]);

  // Handle delete success
  useEffect(() => {
    if (success && showProducts) {
      dispatch(getSellerProductsThunk());
      dispatch(clearProductState());
    }
  }, [success, showProducts, dispatch]);

  const handleLogout = () => {
      dispatch(logout());
      navigate("/");
    };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "May 21, 2024";

  return (
    <div className="px-4 py-5 max-w-3xl  mx-auto my-10">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#211C24] hover:text-gray-600 transition-colors duration-200 mb-4 cursor-pointer"
      >
        <FiArrowLeft className="text-sm" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Header */}
      <h1 className="font-bold text-2xl text-[#211C24]">My Profile</h1>
      <p className="text-sm text-gray-400 mt-1 mb-5">
        View and manage your profile information
      </p>

      {/* Profile Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
              <img
                src="https://i.pinimg.com/736x/7f/ff/68/7fff6829e61d1924c44d8cb5a0cfbdff.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Name + Role Badge */}
            <div>
              <h2 className="font-semibold text-lg text-[#211C24] leading-tight">
                {user?.name || "Hardik Pandya"}
              </h2>
              <span className="inline-block mt-1 text-xs font-medium text-[#3A9743] bg-[#E3F7E7] px-2 py-0.5 rounded">
                {user?.role || "seller"}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          {/* <button className="flex items-center gap-1.5 text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-[#211C24] hover:bg-[#EDEDED] transition-colors duration-200 cursor-pointer">
            <FiEdit2 className="text-xs" />
            Edit Profile
          </button> */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Info Row */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiMail className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="font-medium text-[#211C24]">{user?.email || "next6@yopmail.com"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUser className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Role</p>
              <p className="font-medium text-[#211C24]">{user?.role || "seller"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiCalendar className="text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Member Since</p>
              <p className="font-medium text-[#211C24]">{memberSince}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions — seller only */}
      {isSeller && (
        <div className="mb-4">
          <h3 className="font-semibold text-[#211C24] mb-2">Quick Actions</h3>
          <button
            onClick={() => navigate("/add-product")}
            className="w-full flex items-center justify-between  cursor-pointer bg-[#EDEDED] hover:bg-gray-200 transition-colors duration-200 rounded-xl px-4 py-3.5 mb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <FiPlus className="text-[#211C24]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-[#211C24]">Add Product</p>
                <p className="text-xs text-gray-500">Add a new product to your store</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* Your Products Button */}
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="w-full flex items-center justify-between  cursor-pointer bg-[#EDEDED] hover:bg-gray-200 transition-colors duration-200 rounded-xl px-4 py-3.5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <FiEdit2 className="text-[#211C24]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-[#211C24]">Your Products</p>
                <p className="text-xs text-gray-500">View and manage your listed products</p>
              </div>
            </div>
            <FiChevronRight className={`text-gray-400 transition-transform duration-300 ${showProducts ? 'rotate-90' : ''}`} />
          </button>
        </div>
      )}

      {/* Your Products Section — seller only */}
      {isSeller && showProducts && (
        <div className="mb-4">
          <h3 className="font-semibold text-[#211C24] mb-3">Your Listed Products</h3>
          
          {productsLoading && (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#211C24]"></div>
              <p className="text-gray-600 mt-2">Loading your products...</p>
            </div>
          )}

          {productsError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
              <p className="font-semibold">Error loading products</p>
              <p className="text-sm">{productsError}</p>
            </div>
          )}

          {!productsLoading && !productsError && sellerProducts.length === 0 && (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-500">No products listed yet</p>
              <button
                onClick={() => {
                  setShowProducts(false);
                  navigate("/add-product");
                }}
                className="mt-3 text-[#211C24] font-semibold hover:underline cursor-pointer"
              >
                Add your first product
              </button>
            </div>
          )}

          {!productsLoading && !productsError && sellerProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellerProducts.map((product) => (
                <SellerProductCard
                  key={product._id}
                  product={product}
                  onDelete={() => {
                    // Product will be removed from state automatically
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Section */}
      <div className="mb-4">
        <h3 className="font-semibold text-[#211C24] mb-2">Account</h3>
        <div className="border border-gray-200 rounded-xl bg-white overflow-hidden divide-y divide-gray-100">

          {/* Change Password */}
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#EDEDED] transition-colors duration-200">
            <div className="flex items-center gap-3">
              <FiLock className="text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-[#211C24]">Change Password</p>
                <p className="text-xs text-gray-400">Update your account password</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

          {/* Privacy & Security */}
          <button className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#EDEDED] transition-colors duration-200">
            <div className="flex items-center gap-3">
              <FiShield className="text-gray-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-[#211C24]">Privacy & Security</p>
                <p className="text-xs text-gray-400">Manage your privacy and security settings</p>
              </div>
            </div>
            <FiChevronRight className="text-gray-400" />
          </button>

        </div>
      </div>

      {/* Sign Out */}
      <button className="w-full flex items-center justify-center gap-2 border border-red-400 text-red-500 rounded-xl py-3 text-sm font-semibold hover:bg-red-50 transition-colors duration-200  cursor-pointer"
      onClick={handleLogout}
      >
        <FiLogOut />
        Sign Out
      </button>

    </div>
  );
};

export default Profile;