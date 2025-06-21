import Order from '../../models/Order.js'

const getAllOrdersOfAllUsers = async (req, res) => {
    try {
        const orders = await Order.find({});

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
            message: "Đã xảy ra một số lỗi!",
        });
    }
};

const getOrderDetailsForAdmin = async (req, res) => {
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
            message: "Đã xảy ra một số lỗi!",
        });
    }
};

const updateOrderStatusAndPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;

        console.log('BODY ON BACKEND:', req.body);

        let order = await Order.findById(id);

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
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatusAndPaymentStatus,
};
