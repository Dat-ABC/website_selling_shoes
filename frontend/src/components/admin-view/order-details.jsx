import { useState, useEffect } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllOrdersForAdmin,
    getOrderDetailsForAdmin,
    updateOrderStatusAndPaymentStatus,
} from "@/store/admin/order-slice";
import { toast } from "sonner";

const initialFormData = {
    status: "",
    paymentStatus: "",
};

function AdminOrderDetailsView({ orderDetails }) {
    const [formData, setFormData] = useState(initialFormData);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Khởi tạo giá trị form khi orderDetails thay đổi
    useEffect(() => {
        if (orderDetails) {
            setFormData({
                status: orderDetails.orderStatus || "",
                paymentStatus: orderDetails.paymentStatus || "",
            });
        }
    }, [orderDetails]);

    // Hàm dịch trạng thái đơn hàng
    const getOrderStatusDisplay = (status) => {
        const statusMap = {
            pending: "Chờ xử lý",
            inProcess: "Đang xử lý",
            inShipping: "Đang vận chuyển",
            delivered: "Đã giao hàng",
            confirmed: "Đã xác nhận",
            rejected: "Đã từ chối"
        };
        return statusMap[status] || status;
    };

    // Hàm dịch phương thức thanh toán
    const getPaymentMethodDisplay = (method) => {
        const methodMap = {
            bank_transfer: "Chuyển khoản ngân hàng",
            cod: "Thanh toán khi nhận hàng"
        };
        return methodMap[method] || method;
    };

    // Hàm dịch trạng thái thanh toán
    const getPaymentStatusDisplay = (status) => {
        const statusMap = {
            pending: "Chờ thanh toán",
            paid: "Đã thanh toán",
            failed: "Thanh toán thất bại",
            cancelled: "Đã hủy",
            refunded: "Đã hoàn tiền"
        };
        return statusMap[status] || status;
    };

    console.log("orderDetails", orderDetails);

    function handleUpdateStatus(event) {
        event.preventDefault();
        const { status, paymentStatus } = formData;

        console.log("status", status, "paymentStatus", paymentStatus);

        dispatch(
            updateOrderStatusAndPaymentStatus({
                id: orderDetails?._id,
                orderStatus: status,
                paymentStatus: paymentStatus
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(getOrderDetailsForAdmin(orderDetails?._id));
                dispatch(getAllOrdersForAdmin());
                toast.success(data?.payload?.message);
            }
        });
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0">
                <DialogTitle>
                    Thông tin đơn hàng
                </DialogTitle>
                <DialogDescription>
                    Xem và cập nhật thông tin đơn hàng
                </DialogDescription>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <div className="flex mt-6 items-center justify-between">
                            <p className="font-medium">Mã đơn hàng</p>
                            <Label>{orderDetails?._id}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-medium">Ngày đặt hàng</p>
                            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-medium">Giá đặt hàng</p>
                            <Label>{formatCurrency(orderDetails?.totalAmount)}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-medium">Phương thức thanh toán</p>
                            <Label>{getPaymentMethodDisplay(orderDetails?.paymentMethod)}</Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-medium">Trạng thái thanh toán</p>
                            <Label>
                                <Badge
                                    className={`py-1 px-3 ${orderDetails?.paymentStatus === "paid"
                                        ? "bg-green-500"
                                        : orderDetails?.paymentStatus === "failed" || orderDetails?.paymentStatus === "cancelled"
                                            ? "bg-red-600"
                                            : orderDetails?.paymentStatus === "refunded"
                                                ? "bg-orange-500"
                                                : "bg-yellow-500"
                                        }`}
                                >
                                    {getPaymentStatusDisplay(orderDetails?.paymentStatus)}
                                </Badge>
                            </Label>
                        </div>
                        <div className="flex mt-2 items-center justify-between">
                            <p className="font-medium">Trạng thái đơn hàng</p>
                            <Label>
                                <Badge
                                    className={`py-1 px-3 ${orderDetails?.orderStatus === "confirmed" || orderDetails?.orderStatus === "delivered"
                                        ? "bg-green-500"
                                        : orderDetails?.orderStatus === "rejected"
                                            ? "bg-red-600"
                                            : "bg-blue-500"
                                        }`}
                                >
                                    {getOrderStatusDisplay(orderDetails?.orderStatus)}
                                </Badge>
                            </Label>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="font-medium">Chi tiết đặt hàng</div>
                            <div className="space-y-4">
                                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
                                    orderDetails.cartItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
                                        >
                                            <div className="w-20 h-20 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-base truncate">
                                                    {item.title}
                                                </h4>
                                                <div className="mt-1 text-sm text-muted-foreground space-y-1">
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-medium">Màu:</span>
                                                            {item.color}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-medium">Size:</span>
                                                            {item.size}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-medium">Số lượng:</span>
                                                            {item.quantity}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-medium">Đơn giá:</span>
                                                            {formatCurrency(item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-medium">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted-foreground">
                                        Không có sản phẩm nào
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="font-medium">Thông tin vận chuyển</div>
                            <div className="grid gap-0.5 text-muted-foreground">
                                <span>Tên khách hàng: {user.userName}</span>
                                <span>Địa chỉ: {orderDetails?.addressInfo?.address}</span>
                                <span>Tỉnh: {orderDetails?.addressInfo?.city}</span>
                                <span>Mã: {orderDetails?.addressInfo?.pincode}</span>
                                <span>Số điện thoại: {orderDetails?.addressInfo?.phone}</span>
                                <span>Ghi chú: {orderDetails?.addressInfo?.notes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0 pt-4 border-t">
                <CommonForm
                    formControls={[
                        {
                            label: "Trạng thái thanh toán",
                            name: "paymentStatus",
                            componentType: "select",
                            options: [
                                { id: "pending", label: "Chờ thanh toán" },
                                { id: "paid", label: "Đã thanh toán" },
                                { id: "failed", label: "Thanh toán thất bại" },
                                { id: "cancelled", label: "Đã hủy" },
                                { id: "refunded", label: "Đã hoàn tiền" },
                            ],
                        },
                        {
                            label: "Trạng thái đơn hàng",
                            name: "status",
                            componentType: "select",
                            options: [
                                { id: "pending", label: "Chưa giải quyết" },
                                { id: "inProcess", label: "Đang xử lý" },
                                { id: "inShipping", label: "Đang vận chuyển" },
                                { id: "delivered", label: "Đã giao hàng" },
                                { id: "rejected", label: "Từ chối" },
                            ],
                        },
                    ]}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={"Cập nhật trạng thái"}
                    onSubmit={handleUpdateStatus}
                />
            </div>
        </DialogContent>
    );
}

export default AdminOrderDetailsView;