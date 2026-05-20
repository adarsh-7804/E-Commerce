import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCartThunk } from "../../features/cart/cartSlice";
import { GoArrowUpRight } from "react-icons/go";


const ProductCard = ({ product }) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addToCartThunk());
  })


  return (
    <Link to={`/products/${product._id}`} className="block">
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group">
      {/* Image Container */}
      <div className=" overflow-hidden bg-[#EDEDED] h-64">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Quick View Overlay */}
        {/* <div className="absolute inset-0 bg-[#0B0B0B] bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button className="bg-white text-[#211C24] px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Quick View
          </button>
        </div> */}

        {/* Category Badge */}
        {/* <div className="absolute top-3 left-3 bg-[#211C24] text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div> */}

        {/* Stock Badge */}
        {/* <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>●</span>
          <span className="text-[#2E2E2E]">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
        </div> */}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-[#0B0B0B] mb-2 line-clamp-1 group-hover:text-[#211C24] transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-[#211C24]">
            ₹{product.price?.toLocaleString()}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="flex  items-center justify-center gap-2.5 w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-[#2E2E2E] transition-all duration-300 shadow-md hover:shadow-lg"
        // onClick={() => {dispatch(addToCartThunk({ productId: product._id, quantity:1  }))}}
        >
          <span>View Product</span> <GoArrowUpRight />
        </button>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;