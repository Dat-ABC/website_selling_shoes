import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null,
    bankAccountInfo: null,
};

const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:3000";

export const createNewOrder = createAsyncThunk(
    "/order/createNewOrder",
    async (orderData) => {
        const response = await axios.post(
            `${BACKEND_URL}/api/shop/order/create`,
            orderData
        );

        return response.data;
    }
);

export const confirmBankTransfer = createAsyncThunk(
    "/order/confirmBankTransfer",
    async ({ orderId, transactionId, transferAmount, transferNote }) => {
        const response = await axios.post(
            `${BACKEND_URL}/api/shop/order/confirm-bank-transfer`,
            {
                orderId,
                transactionId,
                transferAmount,
                transferNote,
            }
        );

        return response.data;
    }
);

export const confirmCODDelivery = createAsyncThunk(
    "/order/confirmCODDelivery",
    async ({ orderId }) => {
        const response = await axios.post(
            `${BACKEND_URL}/api/shop/order/confirm-cod-delivery`,
            {
                orderId,
            }
        );

        return response.data;
    }
);

export const checkUserPurchase = createAsyncThunk(
    '/order/checkPurchase',
    async (userId, productId) => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/shop/order/check-purchase/${userId}/${productId}`
            );
            return response.data;
        } catch (error) {
            return {
                success: false,
                hasPurchased: false,
                message: error.response?.data?.message || 'Error checking purchase'
            };
        }
    }
);

export const getAllOrdersByUserId = createAsyncThunk(
    "/order/getAllOrdersByUserId",
    async (userId) => {
        const response = await axios.get(
            `${BACKEND_URL}/api/shop/order/list/${userId}`
        );

        return response.data;
    }
);

export const getOrderDetails = createAsyncThunk(
    "/order/getOrderDetails",
    async (id) => {
        const response = await axios.get(
            `${BACKEND_URL}/api/shop/order/details/${id}`
        );

        return response.data;
    }
);

export const updateOrderStatus = createAsyncThunk(
    'adminOrder/updateStatus',
    async ({ orderId, status, paymentStatus }) => {
        try {
            const response = await axios.put(
                `${BACKEND_URL}/api/admin/orders/update-status/${orderId}`,
                {
                    orderStatus: status,
                    paymentStatus: paymentStatus
                }
            );

            console.log('Update response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Update error:', error.response?.data || error); // Debug log
            throw error;
        }
    }
);

const shoppingOrderSlice = createSlice({
    name: "shoppingOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state) => {
            state.orderDetails = null;
        },
        resetBankAccountInfo: (state) => {
            state.bankAccountInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create new order
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderId = action.payload.orderId;
                state.bankAccountInfo = action.payload.bankAccountInfo || null;

                // Store order ID for later use
                if (action.payload.orderId) {
                    sessionStorage.setItem(
                        "currentOrderId",
                        JSON.stringify(action.payload.orderId)
                    );
                }
            })
            .addCase(createNewOrder.rejected, (state) => {
                state.isLoading = false;
                state.orderId = null;
                state.bankAccountInfo = null;
            })

            // Confirm bank transfer
            .addCase(confirmBankTransfer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(confirmBankTransfer.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update order in list if exists
                const orderIndex = state.orderList.findIndex(
                    order => order._id === action.payload.data._id
                );
                if (orderIndex !== -1) {
                    state.orderList[orderIndex] = action.payload.data;
                }
            })
            .addCase(confirmBankTransfer.rejected, (state) => {
                state.isLoading = false;
            })

            // Confirm COD delivery
            .addCase(confirmCODDelivery.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(confirmCODDelivery.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update order in list if exists
                const orderIndex = state.orderList.findIndex(
                    order => order._id === action.payload.data._id
                );
                if (orderIndex !== -1) {
                    state.orderList[orderIndex] = action.payload.data;
                }
            })
            .addCase(confirmCODDelivery.rejected, (state) => {
                state.isLoading = false;
            })

            // Get all orders by user ID
            .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
            })
            .addCase(getAllOrdersByUserId.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
            })

            // Get order details
            .addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
            })
            .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
            })

            // Update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                // Update order in list
                const orderIndex = state.orderList.findIndex(
                    order => order._id === action.payload.data._id
                );
                if (orderIndex !== -1) {
                    state.orderList[orderIndex] = action.payload.data;
                }
                // Update order details if it's the same order
                if (state.orderDetails && state.orderDetails._id === action.payload.data._id) {
                    state.orderDetails = action.payload.data;
                }
            })
            .addCase(updateOrderStatus.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { resetOrderDetails, resetBankAccountInfo } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;