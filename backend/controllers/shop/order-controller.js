import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            cartId,
            bankInfo, // Thông tin ngân hàng nếu chọn chuyển khoản
        } = req.body;

        // Tạo đơn hàng mới
        const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus: orderStatus || "pending",
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : paymentStatus || "pending",
            totalAmount,
            orderDate: orderDate || new Date(),
            orderUpdateDate: orderUpdateDate || new Date(),
            bankInfo: paymentMethod === "bank_transfer" ? bankInfo : null,
        });

        await newlyCreatedOrder.save();

        // Xử lý theo phương thức thanh toán
        if (paymentMethod === "bank_transfer") {
            // Trả về thông tin ngân hàng để khách hàng chuyển khoản
            const bankAccountInfo = {
                bankName: "Vietcombank",
                accountNumber: "0591000367726",
                accountName: "NGUYEN VAN DAT",
                transferContent: `DH${newlyCreatedOrder._id}`,
                amount: totalAmount,
            };

            res.status(201).json({
                success: true,
                message: "Đơn hàng đã được tạo. Vui lòng chuyển khoản theo thông tin bên dưới.",
                orderId: newlyCreatedOrder._id,
                bankAccountInfo,
                orderDetails: newlyCreatedOrder,
            });
        } else if (paymentMethod === "cod") {
            // Thanh toán khi nhận hàng
            res.status(201).json({
                success: true,
                message: "Đơn hàng đã được tạo. Bạn sẽ thanh toán khi nhận hàng.",
                orderId: newlyCreatedOrder._id,
                orderDetails: newlyCreatedOrder,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Phương thức thanh toán không hợp lệ",
            });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi khi tạo đơn hàng!",
        });
    }
};

const confirmBankTransfer = async (req, res) => {
    try {
        const { orderId, transactionId, transferAmount, transferNote } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng",
            });
        }

        if (order.paymentMethod !== "bank_transfer") {
            return res.status(400).json({
                success: false,
                message: "Đơn hàng này không phải thanh toán bằng chuyển khoản",
            });
        }

        // Cập nhật thông tin chuyển khoản
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.bankTransferInfo = {
            transactionId,
            transferAmount,
            transferNote,
            transferDate: new Date(),
        };
        order.orderUpdateDate = new Date();

        // Trừ số lượng sản phẩm trong kho
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy sản phẩm ${item.title}`,
                });
            }

            if (product.totalStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Không đủ hàng cho sản phẩm ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        // Xóa giỏ hàng
        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({
            success: true,
            message: "Xác nhận chuyển khoản thành công",
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi!",
        });
    }
};

const confirmCODDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng",
            });
        }

        if (order.paymentMethod !== "cod") {
            return res.status(400).json({
                success: false,
                message: "Đơn hàng này không phải thanh toán khi nhận hàng",
            });
        }

        // Cập nhật trạng thái đơn hàng
        order.paymentStatus = "paid";
        order.orderStatus = "delivered";
        order.orderUpdateDate = new Date();
        order.deliveryDate = new Date();

        // Trừ số lượng sản phẩm trong kho
        for (let item of order.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy sản phẩm ${item.title}`,
                });
            }

            if (product.totalStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Không đủ hàng cho sản phẩm ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        // Xóa giỏ hàng
        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({
            success: true,
            message: "Xác nhận giao hàng và thanh toán thành công",
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi!",
        });
    }
};

const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId }).sort({ orderDate: -1 });

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng nào!",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi!",
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng!",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi!",
        });
    }
};

const checkUserPurchase = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const order = await Order.findOne({
            userId,
            'cartItems.productId': productId,
            orderStatus: 'confirmed',
        });

        return res.status(200).json({
            success: true,
            hasPurchased: !!order,
            message: order ? 'User has purchased this product' : 'User has not purchased this product'
        });
    } catch (error) {
        console.error('Check purchase error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error checking purchase history',
            error: error.message
        });
    }
};

const updateOrderStatusAndPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const { orderStatus, paymentStatus } = req.body

        console.log('BODY ON BACKEND:', req.body);

        console.log("id", id)

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng",
            });
        }

        await Order.findByIdAndUpdate(id, { orderStatus, paymentStatus });

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái đơn hàng thành công",
            data: order,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi!",
        });
    }
};

export {
    createOrder,
    confirmBankTransfer,
    confirmCODDelivery,
    getAllOrdersByUser,
    getOrderDetails,
    checkUserPurchase,
    updateOrderStatusAndPaymentStatus,
}