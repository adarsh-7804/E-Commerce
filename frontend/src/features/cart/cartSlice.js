import { createAsyncThunk, createSlice, isActionCreator } from "@reduxjs/toolkit";
import { 
    addToCartApi,
    updateCartItemApi,
    removeCartItemApi,
    getCartApi,
    clearCartApi
 } from "../../services/cartService";

 export const getCartThunk = createAsyncThunk("cart/get", async () => {
    const { data } = await getCartApi(); 
    return data;
 })

 export const addToCartThunk = createAsyncThunk("cart/add",
    async ({ productId, quantity }) => {
        const { data } = await addToCartApi({productId, quantity});
        return data;
    }
 )

 export const updateCartItemThunk = createAsyncThunk(
    "cart/update",
    async ({ productId, quantity }) => {
        const { data } = await updateCartItemApi({ productId, quantity })
        return data;
    }
 )

 export const removeCartItemThunk = createAsyncThunk(
    "cart/remove",
    async (productId) => {
        const { data } = await removeCartItemApi(productId);
        return data
    }
 )

 export const clearCartThunk = createAsyncThunk(
    "cart/clear",
    async () => {
        const { data } = await clearCartApi();
        return data;
    }
 )

 const cartSlice = createSlice({
    name: "cart",
   initialState: {
      cart: null,
      totalItems: 0,
      totalAmount: 0,
      loading: false,
      error: null,
   },
    reducers: {
      clearCartState: (state) => {
        state.cart = null;
        state.totalItems = 0;
        state.totalAmount = 0;
        state.loading = false;
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
         .addCase(getCartThunk.fulfilled, (state, action) => {
            state.cart = action.payload.cart || null;
            state.totalItems = action.payload.totalItems || 0;
            state.totalAmount = action.payload.totalAmount || 0;
         })
         .addCase(addToCartThunk.fulfilled, (state, action) => {
            state.cart = action.payload.cart;
            state.totalItems = action.payload.totalItems || 0;
            state.totalAmount = action.payload.totalAmount || 0;
         })
         .addCase(updateCartItemThunk.fulfilled, (state, action) => {
            state.cart = action.payload.cart;
            state.totalItems = action.payload.totalItems || 0;
            state.totalAmount = action.payload.totalAmount || 0;
         })
         .addCase(removeCartItemThunk.fulfilled, (state, action) => {
            state.cart = action.payload.cart;
            state.totalItems = action.payload.totalItems || 0;
            state.totalAmount = action.payload.totalAmount || 0;
         })
         .addCase(clearCartThunk.fulfilled, (state, action) => {
            state.cart = action.payload.cart || null;
            state.totalItems = action.payload.totalItems || 0;
            state.totalAmount = action.payload.totalAmount || 0;
         });
    }
 })

 export const { clearCartState } = cartSlice.actions;

 export default cartSlice.reducer;

