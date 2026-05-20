import axiosInstance from './axiosInstance';

export const addToCartApi = (payload) => 
    axiosInstance.post("/cart", payload)


export const updateCartItemApi = (payload) => 
    axiosInstance.put("/cart", payload);


export const removeCartItemApi = (productId) => 
    axiosInstance.delete(`/cart/${productId}`)


export const getCartApi = () => 
    axiosInstance.get("/cart", {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }
    })
export const clearCartApi = () => 
    axiosInstance.delete("/cart")
