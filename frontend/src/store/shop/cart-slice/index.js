import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    isLoading: false,
};

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:3000";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async ({ userId, productId, color, size, quantity }) => {
        const response = await axios.post(
            `${BACKEND_URL}/api/shop/cart/add`,
            {
                userId,
                productId,
                color,
                size,
                quantity,
            }
        );

        return response.data;
    }
);

export const fetchCartItems = createAsyncThunk(
    "cart/fetchCartItems",
    async (userId) => {
        const response = await axios.get(
            `${BACKEND_URL}/api/shop/cart/get/${userId}`
        );

        return response.data;
    }
);

export const deleteCartItem = createAsyncThunk(
    'cart/deleteItem',
    async ({ userId, productId, color, size }) => {
        try {
            // let url = `${BACKEND_URL}/api/shop/cart/${userId}/${productId}`;
            // if (color) url += `/${color}`;
            // if (size) url += `/${size}`;
            // const response = await axios.delete(url);
            // return response.data;

            const response = await axios.delete(`${BACKEND_URL}/api/shop/cart/${userId}/${productId}`,
                {
                    data: { color, size }
                });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

export const updateCartQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ userId, productId, quantity, color, size }) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/shop/cart/update-cart`, {
                userId,
                productId,
                quantity,
                color,
                size
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(addToCart.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(fetchCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(fetchCartItems.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(updateCartQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(updateCartQuantity.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            })
            .addCase(deleteCartItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCartItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload.data;
            })
            .addCase(deleteCartItem.rejected, (state) => {
                state.isLoading = false;
                state.cartItems = [];
            });
    },
});

export default shoppingCartSlice.reducer;
