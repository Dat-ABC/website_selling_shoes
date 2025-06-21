import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    productList: [],
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const addNewProduct = createAsyncThunk(
    "/products/addnewproduct",
    async (formData) => {
        const result = await axios.post(
            `${BACKEND_URL}/api/admin/products/add`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result?.data;
    }
);

// export const addNewProduct = createAsyncThunk(
//     'adminProducts/addNewProduct',
//     async (productData) => {
//         try {
//             const response = await axios.post(`${BACKEND_URL}/api/admin/products/add`, {
//                 ...productData,
//                 variants: productData.variants || [] // Đảm bảo variants được gửi đi
//             });
//             return response?.data;
//         } catch (error) {
//             throw error;
//         }
//     }
// );

export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async () => {
        const result = await axios.get(
            `${BACKEND_URL}/api/admin/products/get`
        );

        return result?.data;
    }
);

export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => {
        const result = await axios.put(
            `${BACKEND_URL}/api/admin/products/edit/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result?.data;
    }
);

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {
        const result = await axios.delete(
            `${BACKEND_URL}/api/admin/products/delete/${id}`
        );

        return result?.data;
    }
);

const AdminProductsSlice = createSlice({
    name: "adminProducts",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [];
            });
    },
});

export default AdminProductsSlice.reducer;