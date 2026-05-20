import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createProductAPI, getAllProductsAPI, getSingleProductAPI, updateProductAPI, getSellerProductsAPI, deleteProductAPI } from "../../services/productService";

const initialState = {
    products: [],
    singleProduct: null,
    loading: false,
    error: null,
    success: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        productsPerPage: 8,
        hasNextPage: false,
        hasPrevPage: false,
    },
}

export const createProductThunk = createAsyncThunk(
    "product/create",

    async (productData, thunkAPI) => {
        try {

            const token = thunkAPI.getState().auth.user.token;

            const data = await createProductAPI(productData, token);

            return data;

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create product");
        }
    }
)

export const updateProductThunk = createAsyncThunk(
    "product/update",

    async ({ productData, productId }, thunkAPI) => {
        try {

            const token = thunkAPI.getState().auth.user.token;

            const data = await updateProductAPI(productData, productId, token);
            
            return { ...data, _id: productId };

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update product"); 
        }
    }
)

export const getAllProductsThunk = createAsyncThunk(
    "product/getAll",

    async (params = {}, thunkAPI) => {
        try {
            const { page = 1, limit = 8, search = "", category = "" } = params;
            return await getAllProductsAPI(page, limit, search, category);

        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch products");
        }
    }
)

export const getSingleProductThunk = createAsyncThunk(
    "product/getSingle",

    async (id, thunkAPI) => {
        try {

            return await getSingleProductAPI(id);

        } catch (err) {

            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch product"
            );

        }
    }
);

export const getSellerProductsThunk = createAsyncThunk(
    "product/getSellerProducts",

    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await getSellerProductsAPI(token);
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to fetch seller products"
            );
        }
    }
);

export const deleteProductThunk = createAsyncThunk(
    "product/delete",

    async (productId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            await deleteProductAPI(productId, token);
            return productId;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed to delete product"
            );
        }
    }
);

const productSlice = createSlice({

    name: "product",

    initialState,

    reducers: {

        clearProductState: (state) => {

            state.error = null;
            state.success = false;

        },

    },

    extraReducers: (builder) => {

        builder

            .addCase(createProductThunk.pending, (state) => {

                state.loading = true;

            })

            .addCase(createProductThunk.fulfilled, (state, action) => {

                state.loading = false;
                state.success = true;

                state.products.push(action.payload);

            })

            .addCase(createProductThunk.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        builder
            .addCase(getAllProductsThunk.pending, (state) => {

                state.loading = true;

            })

            .addCase(getAllProductsThunk.fulfilled, (state, action) => {

                state.loading = false;

                state.products = action.payload.products || action.payload;
                state.pagination = action.payload.pagination || state.pagination;

            })

            .addCase(getAllProductsThunk.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            })

        builder
            .addCase(getSingleProductThunk.pending, (state) => {

                state.loading = true;

            })

            .addCase(getSingleProductThunk.fulfilled, (state, action) => {

                state.loading = false;

                state.singleProduct = action.payload;

            })

            .addCase(getSingleProductThunk.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;

            });

        builder

            .addCase(updateProductThunk.pending, (state) => {

                state.loading = true;

            })

            .addCase(updateProductThunk.fulfilled, (state, action) => {

                state.loading = false;
                state.success = true;

                const index = state.products.findIndex(p => p._id === action.payload._id)
                if(index !== -1) {
                    state.products[index] = action.payload;
                } 
                state.singleProduct = action.payload;

            })

            .addCase(updateProductThunk.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        builder

            .addCase(getSellerProductsThunk.pending, (state) => {

                state.loading = true;

            })

            .addCase(getSellerProductsThunk.fulfilled, (state, action) => {

                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : action.payload.products || [];

            })

            .addCase(getSellerProductsThunk.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

        builder

            .addCase(deleteProductThunk.pending, (state) => {

                state.loading = true;

            })

            .addCase(deleteProductThunk.fulfilled, (state, action) => {

                state.loading = false;
                state.success = true;
                state.products = state.products.filter(p => p._id !== action.payload);

            })

            .addCase(deleteProductThunk.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });

    },

});


export const {
    clearProductState,
} = productSlice.actions;

export default productSlice.reducer;