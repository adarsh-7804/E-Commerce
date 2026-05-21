import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
    loginUserAPI,
    registerUserAPI,
    verifyOTPAPI,
    resendOTPAPI,
    setRoleAPI,
    logoutUserAPI,
} from "../../services/authService";

const userFromStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

const initialState = {
    user: userFromStorage,
    loading: false,
    error: null,
    otpPending: false,
    userId: null,
    email: null,
    requiresRoleSelection: false,
}

export const registerUserThunk = createAsyncThunk(
    "auth/registerUser",
    async (userData, thunkAPI) => {
        try {

            const data = await registerUserAPI(userData);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message || "Registration failed");
        }
    }
)

export const loginUserThunk = createAsyncThunk(
    "auth/loginUser",

    async (userData, thunkAPI) => {
        try {
            const data = await loginUserAPI(userData);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message || "Login Failed");
        }
    }
)

export const verifyOTPThunk = createAsyncThunk(
    "auth/verifyOTP",
    async (otpData, thunkAPI) => {
        try {
            const data = await verifyOTPAPI(otpData);

            localStorage.setItem("user", JSON.stringify(data));

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message || "OTP verification failed");
        }
    }
)

export const resendOTPThunk = createAsyncThunk(
    "auth/resendOTP",
    async (userId, thunkAPI) => {
        try {
            const data = await resendOTPAPI(userId);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to resend OTP");
        }
    }
)

export const setRoleThunk = createAsyncThunk(
    "auth/setRole",
    async (roleData, thunkAPI) => {
        try {
            const data = await setRoleAPI(roleData);

            localStorage.setItem("user", JSON.stringify(data));

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message || "Failed to set role");
        }
    }
)

export const logoutUserThunk = createAsyncThunk(
    "auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            await logoutUserAPI();

            localStorage.removeItem("user");

            return;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data.message || "Logout Failed");
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        },
        clearError: (state) => {
            state.error = null;
        },
        googleLoginSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            state.otpPending = false;
            state.requiresRoleSelection =
                action.payload.requiresRoleSelection || false;
        },
    },
    extraReducers: (builder) => {

        builder
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            });

        builder
            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.otpPending = true;
                state.userId = action.payload.userId;
                state.email = action.payload.email;
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(verifyOTPThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTPThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.otpPending = false;
                state.userId = null;
                state.email = null;

                if (action.payload.requiresRoleSelection) {
                    state.requiresRoleSelection = true;
                    state.user = action.payload;
                } else {
                    state.user = action.payload;
                    state.requiresRoleSelection = false;
                }
            })
            .addCase(verifyOTPThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(resendOTPThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOTPThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resendOTPThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
        // })

        builder
            .addCase(setRoleThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setRoleThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload;
                state.requiresRoleSelection = false;
            })
            .addCase(setRoleThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(logoutUserThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUserThunk.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const { logout, clearError, googleLoginSuccess } = authSlice.actions;

export default authSlice.reducer;