import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export const registerUser = createAsyncThunk('auth/register',
    async (formData) => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/register`, formData, {
            withCredentials: true,
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Cache-Control': 'no-cache',
            //     'Expires': '0',
            //     'Pragma': 'no-cache'
            // }
        });

        return response.data;
    }
);

export const loginUser = createAsyncThunk('auth/login',
    async (formData) => {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, formData, {
            withCredentials: true
        });

        return response.data;
    }
);

export const logoutUser = createAsyncThunk(
    "/auth/logout",

    async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/auth/logout`,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const checkAuth = createAsyncThunk('auth/checkauth',
    async () => {
        const response = await axios.get(`${BACKEND_URL}/api/auth/check-auth`, {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate, poxy-revalidate'
            }
        });

        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        isLoading: true,
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            // state.user = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        }).addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false; // Assuming registration does not automatically log in the user
            state.user = null  //.user; // Assuming the response contains user data
        }).addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            // console.error("Registration failed:", action.error.message);
        }).addCase(loginUser.pending, (state) => {
            state.isLoading = true;
        }
        ).addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true; // Assuming login sets the user as authenticated
            state.user = action.payload.user; // Assuming the response contains user data
        }).addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            // console.error("Login failed:", action.error.message);
        }).addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
        }
        ).addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = action.payload.success; // Assuming the response indicates success
            state.user = action.payload.user || null; // Assuming the response contains user data
        }).addCase(checkAuth.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            // console.error("Check auth failed:", action.error.message);
        }).addCase(logoutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        });
    }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer