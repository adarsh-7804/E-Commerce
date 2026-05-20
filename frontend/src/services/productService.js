import axios from "axios";

const API_URL = "http://localhost:5000/api/products";


export const createProductAPI = async (productData, token) => {

    const response = await axios.post(
        API_URL,
        productData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                // "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const updateProductAPI = async (productData, productId , token) => {

    const response = await axios.put(
        `${API_URL}/${productId}`,
        productData,
        {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        }
    )

    return response.data
}

export const getAllProductsAPI = async (page = 1, limit = 10, search = "", category = "") => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    
    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
}

export const getSingleProductAPI = async (productId) => {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
}

export const getSellerProductsAPI = async (token) => {
    const response = await axios.get(`${API_URL}/seller/my-products`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}

export const deleteProductAPI = async (productId, token) => {
    const response = await axios.delete(`${API_URL}/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}


// import axios from "axios";

// const API_URL = "https://dummyjson.com/c/6071-b43f-40b2-adbe";


// // CREATE PRODUCT
// export const createProductAPI = async (productData) => {

//     return {
//         success: true,
//         product: {
//             _id: Date.now(),
//             ...productData,
//         },
//     };
// };


// // GET ALL PRODUCTS
// export const getAllProductsAPI = async () => {

//     const response = await axios.get(API_URL);

//     return response.data;
// };


// // GET SINGLE PRODUCT
// export const getSingleProductAPI = async (productId) => {

//     const response = await axios.get(
//         `${API_URL}/${productId}`
//     );

//     return response.data;
// };