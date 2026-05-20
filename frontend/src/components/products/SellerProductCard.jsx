import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deleteProductThunk } from "../../features/products/productSlice";

const SellerProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    navigate(`/add-product/${product._id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProductThunk(product._id));
    successToast("Product deleted successfully");
    setDeleteConfirm(false);
    if (onDelete) {
      onDelete(product._id);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="overflow-hidden bg-[#EDEDED] h-56 relative">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/300"}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-base font-bold text-[#0B0B0B] mb-1 line-clamp-1">
          {product.title}
        </h3>

        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-[#211C24]">
            ₹{product.price?.toLocaleString()}
          </div>
          <span className="text-xs bg-[#EDEDED] text-[#211C24] px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-[#211C24] text-white py-2 rounded-lg font-semibold hover:bg-[#2E2E2E] transition-all duration-300 text-sm cursor-pointer"
          >
            <FiEdit2 className="text-sm" />
            Edit
          </button>
          {deleteConfirm ? (
            <>
              <button
                onClick={confirmDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 text-sm cursor-pointer"
              >
                <FiTrash2 className="text-sm" />
                Confirm
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition-all duration-300 text-sm cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 text-sm cursor-pointer"
            >
              <FiTrash2 className="text-sm" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductCard;
