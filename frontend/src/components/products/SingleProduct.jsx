import React, { useState, useEffect } from "react";
import {
  FaChevronRight,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaArrowLeft,
} from "react-icons/fa";
import { useParams, useNavigate, useAsyncError } from "react-router-dom";
import { getSingleProductAPI } from "../../services/productService";
import { addToCartThunk } from "../../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

// Mock product data matching your Mongoose schema
const mockProduct = {
  _id: "64f1a2b3c4d5e6f7a8b9c0d1",
  title: "Product Title",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel sapien eget nunc efficitur varius. Sed at felis ac nisl bibendum tincidunt.",
  price: 999,
  stock: 12,
  category: "Electronics",
  images: [
    "https://images.pexels.com/photos/5961216/pexels-photo-5961216.jpeg",
    "https://images.pexels.com/photos/14824331/pexels-photo-14824331.jpeg",
    "https://images.pexels.com/photos/7987295/pexels-photo-7987295.jpeg",
    "https://images.pexels.com/photos/37397665/pexels-photo-37397665.jpeg",
  ],
  seller: "64f1a2b3c4d5e6f7a8b9c0d2",
  createdAt: new Date().toISOString(),
};

const SingleProduct = ({ product }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Get quantity already in cart for this product
  const cartQuantity =
    cart?.items?.find((item) => item.product?._id === id)?.quantity || 0;
  const totalQuantity = cartQuantity + quantity;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSingleProductAPI(id);
        setProductData(data);
      } catch (err) {
        setError(err.message || "Failed to load product");
        setProductData(mockProduct); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#211C24]"></div>
          <p className="mt-4 text-[#211C24] font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-[#EDEDED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold text-lg">
            Error: {error || "Product not found"}
          </p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEDED] font-sans">
      {/* Back Button */}
      <div className="mx-[5vw] pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#211C24] hover:text-gray-600 transition-colors duration-200 mb-3  cursor-pointer"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mx-[5vw] pt-2 pb-2">
        <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-[#211C24] cursor-pointer transition-colors duration-200">
            Home
          </span>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="hover:text-[#211C24] cursor-pointer transition-colors duration-200">
            {productData.category}
          </span>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="text-[#211C24] font-medium">
            {productData.title}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-[5vw] my-6">
        <div className="flex flex-col lg:flex-row gap-6 bg-[#FFFFFF] rounded-2xl shadow-sm overflow-hidden">
          {/* ── Left: Image Gallery ── */}
          <div className="lg:w-1/2 bg-[#EDEDED] p-8 flex flex-col items-center gap-4">
            {/* Main Image */}
            <div className="w-full aspect-square max-w-md bg-white rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
              <img
                src={
                  productData.images?.[selectedImage] ||
                  "https://via.placeholder.com/300"
                }
                alt={productData.title}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/300")
                }
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Thumbnails */}
            {productData.images.length > 1 && (
              <div className="flex gap-3 mt-2  ">
                {productData.images.slice(1).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx + 1)}
                    className={`w-16 h-16  rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === idx + 1
                        ? "border-[#211C24] shadow-md scale-105"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${idx + 1}`}
                      className="w-full h-full object-cover cursor-pointer "
                    />
                  </button>
                ))}
                <button
                  onClick={() => setSelectedImage(0)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === 0
                      ? "border-[#211C24] shadow-md scale-105"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={productData.images[0]}
                    alt="Main thumb"
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </button>
              </div>
            )}
          </div>

          {/* ── Right: Product Details ── */}
          <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col justify-center">
            {/* Category Badge */}
            <span className="inline-block self-start bg-[#EDEDED] text-[#211C24] text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              {productData.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-[#211C24] mb-3 leading-tight">
              {productData.title}
            </h1>

            {/* Rating Row
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-amber-400 text-sm">
                                {[1,2,3,4].map(i => <FaStar key={i} />)}
                                <FaStar className="text-gray-300" />
                            </div>
                            <span className="text-sm text-gray-500">(4.0) · 128 reviews</span>
                        </div> */}

            {/* Divider */}
            <div className="border-t border-[#EDEDED] my-4" />

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {productData.description}
            </p>

            {/* Price + Stock */}
            <div className="flex items-end gap-4 mb-6">
              <span className="text-4xl font-extrabold text-[#211C24]">
                ₹{productData.price.toLocaleString("en-IN")}
              </span>
              {/* <span
                className={`text-sm font-medium pb-1 ${productData.stock > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {productData.stock > 0
                  ? `${productData.stock} in stock`
                  : "Out of stock"}
              </span> */}
            </div>

            {/* Divider */}
            <div className="border-t border-[#EDEDED] mb-6" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setWishlistAdded(!wishlistAdded)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl cursor-pointer font-semibold text-sm border-2 transition-all duration-300 ${
                  wishlistAdded
                    ? "bg-[#211C24] text-white border-[#211C24]"
                    : "bg-white text-[#211C24] border-[#211C24] hover:bg-[#211C24] hover:text-white"
                }`}
              >
                <FaHeart className={wishlistAdded ? "text-red-400" : ""} />
                {wishlistAdded ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <button
                onClick={() => {
                  dispatch(
                    addToCartThunk({ productId: productData._id, quantity }),
                  );
                  setCartAdded(true);
                  setQuantity(1);
                  setTimeout(() => setCartAdded(false), 2000);
                }}
                className={`flex-1 flex cursor-pointer items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                  cartAdded
                    ? "bg-green-600 text-white"
                    : "bg-[#211C24] text-white hover:bg-[#3a3540]"
                }`}
              >
                <FaShoppingCart />
                {cartAdded ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>

            {/* Seller / Meta Info */}
            <div className="flex justify-between">
              <p className="text-xs text-gray-400 mt-5">
                Sold by{" "}
                <span className="font-medium text-gray-500">
                  ShopSphere Seller
                </span>{" "}
                · Listed{" "}
                {new Date(productData.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>

              {/* <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-[#211C24] hover:bg-[#EDEDED] disabled:opacity-50 transition-colors text-lg font-light"
                >
                  −
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-[#211C24] border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={totalQuantity >= productData.stock}
                  className="w-8 h-8 flex items-center justify-center text-[#211C24] hover:bg-[#EDEDED] disabled:opacity-50 transition-colors text-lg font-light"
                >
                  +
                </button>
                </div> */}
                <div className="flex items-center gap-3 mt-3 mb-6">
                 <label className="text-sm font-semibold text-[#2E2E2E]">
                   Quantity:
                 </label>
                 <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                    
                  
                <button 
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#EDEDED]"
                >
                    −
                  </button>
                  <div className="px-3 border-x border-gray-300 font-semibold flex flex-col items-center justify-center min-w-fit">
                    <span className="text-sm">{quantity}</span>
                    {cartQuantity > 0 && (
                      <span className="text-xs text-gray-500">
                        +{cartQuantity} in cart
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-[#EDEDED]"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;

