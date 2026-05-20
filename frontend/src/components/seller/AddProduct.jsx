import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProductThunk, updateProductThunk, getSingleProductThunk, clearProductState } from '../../features/products/productSlice';


const AddProduct = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID if editing

    const { loading, error, success, singleProduct } = useSelector((state) => state.product);
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        // stock: "",
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    // Fetch product data if in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            dispatch(getSingleProductThunk(id));
        }
    }, [id, isEditMode, dispatch]);

    // Populate form when product data is fetched
    useEffect(() => {
        if (isEditMode && singleProduct) {
            setFormData({
                title: singleProduct.title || "",
                description: singleProduct.description || "",
                price: singleProduct.price || "",
                category: singleProduct.category || "",
            });
            setExistingImages(singleProduct.images || []);
        }
    }, [singleProduct, isEditMode]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleImageChange = (e) => {
        setImages(e.target.files);
    }

    const handleRemoveExistingImage = (index) => {
        setExistingImages(existingImages.filter((_, i) => i !== index));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("category", formData.category);
        // data.append("stock", formData.stock);

        for (let i = 0; i < images.length; i++) {
            data.append("images", images[i]);
        }

        // Append existing images that weren't removed (only for edit mode)
        if (isEditMode) {
            for (let i = 0; i < existingImages.length; i++) {
                data.append("existingImages", existingImages[i]);
            }
            // Dispatch update thunk with both productData and productId
            dispatch(updateProductThunk({ productData: data, productId: id }));
        } else {
            // Dispatch create thunk
            dispatch(createProductThunk(data));
        }
    }

    useEffect(() => {
        if (success) {
            const message = isEditMode ? "Product updated successfully!" : "Product created successfully!";
            alert(message);
            dispatch(clearProductState());

            if (!isEditMode) {
                setFormData({
                    title: "",
                    description: "",
                    price: "",
                    category: "",
                });
                setImages([]);
            }
            
            navigate(-1);
        }
        if (error) {
            alert(error);
            dispatch(clearProductState());
        }
    }, [success, error, dispatch, isEditMode, navigate]);

    return (

    <div className="min-h-screen bg-[#EDEDED] py-10 px-6">

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#211C24] hover:text-gray-600 transition-colors duration-200 mb-4 text-sm font-medium  cursor-pointer"
            >
                ← Back
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-[#211C24] mb-8">
                {isEditMode ? "Edit Product" : "Add Product"}
            </h2>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Title */}
                <div>

                    <label className="block mb-2 font-semibold text-[#2E2E2E]">
                        Product Title
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter product title"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#211C24]"
                        required
                    />

                </div>


                {/* Description */}
                <div>

                    <label className="block mb-2 font-semibold text-[#2E2E2E]">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Enter product description"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#211C24]"
                        required
                    />

                </div>


                {/* Price */}
                <div>

                    <label className="block mb-2 font-semibold text-[#2E2E2E]">
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#211C24]"
                        required
                    />

                </div>


                {/* Stock */}
                {/* <div>

                    <label className="block mb-2 font-semibold text-[#2E2E2E]">
                        Stock
                    </label>

                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="Enter stock quantity"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#211C24]"
                        required
                    />

                </div> */}


                {/* Category */}
                <div>

                    <label className="block mb-2 font-semibold text-[#2E2E2E]">
                        Category
                    </label>

                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Enter category"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#211C24]"
                        required
                    />

                </div>

                {/* Existing Images (Edit Mode) */}
                {isEditMode && existingImages.length > 0 && (
                    <div>
                        <label className="block mb-2 font-semibold text-[#2E2E2E]">
                            Current Images
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {existingImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img}
                                        alt="current"
                                        className="w-full h-32 object-cover rounded-lg border"
                                        onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Images */}
                <div>

                    <label className="block mb-2 font-semibold text-[#2E2E2E]">
                        {isEditMode ? "Add New Images" : "Upload Images"}
                    </label>

                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                        required={!isEditMode}
                    />

                </div>


                {/* Preview Images */}
                {images.length > 0 && (

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        {Array.from(images).map((img, index) => (

                            <img
                                key={index}
                                src={URL.createObjectURL(img)}
                                alt="preview"
                                className="w-full h-32 object-cover rounded-lg border"
                            />

                        ))}

                    </div>

                )}


                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#211C24] text-white py-3 rounded-lg font-semibold hover:bg-[#2E2E2E] transition-all  cursor-pointer"
                >

                    {loading
                        ? (isEditMode ? "Updating..." : "Uploading...")
                        : (isEditMode ? "Update Product" : "Add Product")}

                </button>

            </form>

        </div>

    </div>

);
}

export default AddProduct
