import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    addAddressAPI,
    getUserAddressesAPI,
    getAddressByIdAPI,
    updateAddressAPI,
    deleteAddressAPI,
    setDefaultAddressAPI,
} from "../../services/addressService";

const initialState = {
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,
};

// Add a new address
export const addAddressThunk = createAsyncThunk(
    "address/addAddress",
    async (addressData, thunkAPI) => {
        try {
            const data = await addAddressAPI(addressData);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add address");
        }
    }
);

// Get all addresses
export const getUserAddressesThunk = createAsyncThunk(
    "address/getUserAddresses",
    async (_, thunkAPI) => {
        try {
            const data = await getUserAddressesAPI();
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch addresses");
        }
    }
);

// Get a single address
export const getAddressByIdThunk = createAsyncThunk(
    "address/getAddressById",
    async (addressId, thunkAPI) => {
        try {
            const data = await getAddressByIdAPI(addressId);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch address");
        }
    }
);

// Update an address
export const updateAddressThunk = createAsyncThunk(
    "address/updateAddress",
    async ({ addressId, addressData }, thunkAPI) => {
        try {
            const data = await updateAddressAPI(addressId, addressData);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update address");
        }
    }
);

// Delete an address
export const deleteAddressThunk = createAsyncThunk(
    "address/deleteAddress",
    async (addressId, thunkAPI) => {
        try {
            const data = await deleteAddressAPI(addressId);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete address");
        }
    }
);

// Set default address
export const setDefaultAddressThunk = createAsyncThunk(
    "address/setDefaultAddress",
    async (addressId, thunkAPI) => {
        try {
            const data = await setDefaultAddressAPI(addressId);
            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to set default address");
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSelectedAddress: (state) => {
            state.selectedAddress = null;
        },
    },
    extraReducers: (builder) => {
        // Add Address
        builder
            .addCase(addAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAddressThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload.address);
            })
            .addCase(addAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get User Addresses
        builder
            .addCase(getUserAddressesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserAddressesThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload.addresses;
            })
            .addCase(getUserAddressesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get Address by ID
        builder
            .addCase(getAddressByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAddressByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAddress = action.payload.address;
            })
            .addCase(getAddressByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update Address
        builder
            .addCase(updateAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAddressThunk.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex(
                    (addr) => addr._id === action.payload.address._id
                );
                if (index !== -1) {
                    state.addresses[index] = action.payload.address;
                }
                state.selectedAddress = action.payload.address;
            })
            .addCase(updateAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete Address
        builder
            .addCase(deleteAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAddressThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(
                    (addr) => addr._id !== action.payload.address._id
                );
            })
            .addCase(deleteAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Set Default Address
        builder
            .addCase(setDefaultAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.map((addr) => ({
                    ...addr,
                    isDefault: addr._id === action.payload.address._id,
                }));
                state.selectedAddress = action.payload.address;
            })
            .addCase(setDefaultAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
