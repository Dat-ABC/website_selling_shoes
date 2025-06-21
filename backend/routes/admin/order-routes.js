import express from 'express'

import {
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatusAndPaymentStatus,
} from '../../controllers/admin/order-controller.js'

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatusAndPaymentStatus);

export default router