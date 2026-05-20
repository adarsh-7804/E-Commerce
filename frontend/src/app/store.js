import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import addressReducer from "../features/address/addressSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        address: addressReducer,
    },
})