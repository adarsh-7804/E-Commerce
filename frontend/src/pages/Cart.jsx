import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getCartThunk,
  updateCartItemThunk,
  removeCartItemThunk,
  clearCartThunk,
} from "./../features/cart/cartSlice";
import {
  FiShoppingCart,
  FiTrash2,
  FiChevronLeft,
  FiArrowRight,
  FiLock,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeadphones,
  FiTag,
  FiX,
} from "react-icons/fi";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/user/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SHIPPING = 99;
const DISCOUNT = 500;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, totalItems, totalAmount } = useSelector((s) => s.cart);
  const { selectedAddress } = useSelector((s) => s.address);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    dispatch(getCartThunk());
  }, [dispatch]);

  const subtotal = totalAmount || 0;
  const total = Math.max(0, subtotal - DISCOUNT + SHIPPING);

  const trustBadges = [
    {
      icon: <FiShield />,
      title: "Secure Payment",
      desc: "100% secure payments",
    },
    { icon: <FiTruck />, title: "Fast Delivery", desc: "Delivery in 2-5 days" },
    {
      icon: <FiRefreshCw />,
      title: "Easy Returns",
      desc: "30 day return policy",
    },
    {
      icon: <FiHeadphones />,
      title: "24/7 Support",
      desc: "We're here to help",
    },
  ];

  const isEmpty = !cart?.items?.length;

  const handleCheckoutClick = () => {
    if (!selectedAddress) {     
      navigate("/add-address");
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-[#EDEDED] px-4 py-6 md:px-8">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#211C24]">
            My Cart
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review the items in your cart before checkout.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm border border-gray-300 bg-white rounded-lg px-3 py-2 text-[#211C24] hover:bg-[#EDEDED] transition-colors duration-200 whitespace-nowrap"
        >
          <FiChevronLeft /> Continue Shopping
        </button>
      </div>

      {isEmpty ? (
        /* ── Empty State ── */
        <div className="bg-white rounded-2xl p-16 flex flex-col items-center text-center shadow-sm">
          <FiShoppingCart className="text-6xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-[#211C24] mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Add some products to get started.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#211C24] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3a3540] transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Left: Cart Items ── */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Table Header — desktop only */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <span>Product</span>
                <span>Price</span>
                <span className="text-center">Quantity</span>
                <span>Subtotal</span>
                <span />
              </div>

              {/* Cart Rows */}
              <div className="divide-y divide-gray-100">
                {cart.items.filter(item => item.product?._id).map((item) => {
                  const price = item.product?.price || 0;
                  const subtotalItem = price * item.quantity;
                  return (
                    <div
                      key={item.product._id}
                      className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 items-start md:items-center px-6 py-5"
                    >
                      {/* Product Info */}
                      <Link to={`/products/${item.product._id}`} className="block">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#EDEDED] overflow-hidden flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiShoppingCart className="text-2xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#211C24] text-sm leading-snug">
                            {item.product.title}
                          </p>
                          {item.product.description && (
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 max-w-[200px]">
                              {item.product.description}
                            </p>
                          )}
                          {/* <span className="text-xs font-medium text-green-600 mt-1 inline-block">
                            {item.product.stock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span> */}
                        </div>
                      </div>

                      </Link>

                      {/* Price */}
                      <p className="text-sm font-medium text-[#211C24] md:block">
                        <span className="md:hidden text-gray-400 mr-1 text-xs">
                          Price:{" "}
                        </span>
                        ₹
                        {price.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden w-fit">
                        <button
                          onClick={() =>
                            dispatch(
                              updateCartItemThunk({
                                productId: item.product._id,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#211C24] hover:bg-[#EDEDED] transition-colors text-lg font-light"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold text-[#211C24] border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateCartItemThunk({
                                productId: item.product._id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#211C24] hover:bg-[#EDEDED] transition-colors text-lg font-light"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="text-sm font-semibold text-[#211C24]">
                        <span className="md:hidden text-gray-400 mr-1 text-xs font-normal">
                          Subtotal:{" "}
                        </span>
                        ₹
                        {subtotalItem.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          dispatch(removeCartItemThunk(item.product._id))
                        }
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart */}
              <div className="px-6 py-4 border-t border-gray-100">
                {deleteConfirm ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        dispatch(clearCartThunk());
                        setDeleteConfirm(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 text-sm border border-red-300 bg-red-50 rounded-lg px-4 py-2 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Yes, Clear
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="flex-1 flex items-center justify-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-2 text-[#211C24] hover:bg-[#EDEDED] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-2 text-sm border border-gray-300 rounded-lg px-4 py-2 text-[#211C24] hover:bg-[#EDEDED] transition-colors"
                  >
                    <FiTrash2 className="text-xs" /> Clear Cart
                  </button>
                )}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trustBadges.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#211C24]">
                        {b.title}
                      </p>
                      <p className="text-xs text-gray-400">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:w-80 xl:w-96 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-[#211C24] mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-[#211C24]">
                    ₹
                    {subtotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="font-medium text-green-600">
                    - ₹
                    {DISCOUNT.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-[#211C24]">
                    ₹
                    {SHIPPING.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-4" />

              <div className="flex justify-between items-end mb-1">
                <span className="font-bold text-[#211C24] text-base">
                  Total
                </span>
                <span className="font-bold text-[#211C24] text-xl">
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-5">(Incl. of all taxes)</p>

              {/* Coupon */}
              <div className="flex items-center justify-between border border-dashed border-gray-300 rounded-xl px-4 py-3 mb-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <FiTag />
                  <span>Have a coupon code?</span>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Apply Coupon
                </button>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm"
              >
                Proceed to Payment <FiArrowRight />
              </button>

              {/* Secure Checkout */}
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
                <FiLock className="text-xs" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Modal ── */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#211C24]">Complete Payment</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="text-xl text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {/* Order Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">Order Total</p>
                <p className="text-2xl font-bold text-[#211C24] mb-2">
                  ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">
                  Subtotal: ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })} | 
                  Discount: -₹{DISCOUNT} | 
                  Shipping: ₹{SHIPPING}
                </p>
              </div>

              {/* Stripe Elements */}
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  items={cart.items}
                  totalAmount={total}
                  address={selectedAddress}
                  onSuccess={() => {
                    setShowCheckout(false);
                    dispatch(clearCartThunk());
                  }}
                />
              </Elements>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
