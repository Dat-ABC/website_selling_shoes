import express from 'express';
import {
    createOrder,
    confirmBankTransfer,
    confirmCODDelivery,
    getAllOrdersByUser,
    getOrderDetails,
    checkUserPurchase,
    updateOrderStatusAndPaymentStatus,
} from '../../controllers/shop/order-controller.js'

const router = express.Router();

router.post("/create", createOrder);
router.post("/confirm-bank-transfer", confirmBankTransfer);
router.post("/confirm-cod-delivery", confirmCODDelivery);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.get('/check-purchase/:userId/:productId', checkUserPurchase);
router.post("/update-status", updateOrderStatusAndPaymentStatus);

export default router
