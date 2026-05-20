import React, { useState } from "react";

import ProductCard from "../components/products/ProductCard";

import two from "../assets/two.png";

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useRef } from "react";

import { getAllProductsThunk } from "../features/products/productSlice";
import { addToCartThunk } from "../features/cart/cartSlice";


const Home = () => {

  const dispatch = useDispatch();

  const {
    products,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.product);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const searchTimeoutRef = useRef(null);

  // Debounce search input - wait 500ms after user stops typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 2000);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  // Fetch products when page, search, or category changes
  useEffect(() => {
    const category = selectedCategory === "All" ? "" : selectedCategory;
    dispatch(getAllProductsThunk({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      category: category,
    }));
  }, [dispatch, currentPage, itemsPerPage, debouncedSearch, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDEDED]">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#211C24] to-[#2E2E2E] text-white  ">
        <img src={two} className="w-full h-full" />

      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 px-6 md:px-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#211C24]">50+</div>
            <div className="text-gray-600 mt-1">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#211C24]">4.5★</div>
            <div className="text-gray-600 mt-1">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#211C24]">15+</div>
            <div className="text-gray-600 mt-1">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#211C24]">24/7</div>
            <div className="text-gray-600 mt-1">Support</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">

        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B0B0B] mb-2">
            Browse Our Collection
          </h2>
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products (Page {pagination.currentPage} of {pagination.totalPages})
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">

            {/* Search Box */}
            <div className="w-full md:w-64">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full px-4 py-2 bg-[#EDEDED] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#211C24] text-[#2E2E2E] font-medium"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1); // Reset to first page on category change
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat
                      ? "bg-[#211C24] text-white shadow-lg"
                      : "bg-[#EDEDED] text-[#2E2E2E] hover:bg-gray-300"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Per Page */}
            <div className="w-full md:w-auto">
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-3">
                Items Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}
                className="w-full px-4 py-2 bg-[#EDEDED] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#211C24] text-[#2E2E2E] font-medium"
              >
                <option value="4">4 per page</option>
                <option value="8">8 per page</option>
                <option value="20">20 per page</option>
                <option value="48">48 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination.totalProducts > 0 && (
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPrevPage}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                pagination.hasPrevPage
                  ? "bg-[#211C24] text-white hover:bg-[#2E2E2E] cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              ← Previous
            </button>

            {/* Page Info */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        pageNum === pagination.currentPage
                          ? "bg-[#211C24] text-white shadow-lg"
                          : "bg-[#EDEDED] text-[#2E2E2E] hover:bg-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNextPage}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                pagination.hasNextPage
                  ? "bg-[#211C24] text-white hover:bg-[#2E2E2E] cursor-pointer"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next →
            </button>
          </div>
        )}

      </div>

      {/* Newsletter Section */}
      {/* <div className="bg-[#211C24] text-white py-16 px-6 md:px-10 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get the latest updates on new products and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-[#211C24] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div> */}

    </div>
  );
};

export default Home;