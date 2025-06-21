import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function ShoppingOrderDetailsView({ orderDetails }) {
    const { user } = useSelector((state) => state.auth);

    const getPaymentMethodDisplay = (paymentMethod) => {
        switch (paymentMethod) {
            case "bank_transfer":
                return "Chuyển khoản ngân hàng";
            case "cod":
                return "Thanh toán khi nhận hàng";
            default:
                return paymentMethod;
        }
    };

    const getPaymentStatusDisplay = (paymentStatus) => {
        switch (paymentStatus) {
            case "paid":
                return "Đã thanh toán";
            case "pending":
                return "Chờ thanh toán";
            case "failed":
                return "Thanh toán thất bại";
            default:
                return paymentStatus;
        }
    };

    const getOrderStatusDisplay = (orderStatus) => {
        switch (orderStatus) {
            case "pending":
                return "Chờ xử lý";
            case "confirmed":
                return "Đã xác nhận";
            case "processing":
                return "Đang xử lý";
            case "shipped":
                return "Đang giao hàng";
            case "delivered":
                return "Đã giao hàng";
            case "cancelled":
                return "Đã hủy";
            case "rejected":
                return "Đã từ chối";
            default:
                return orderStatus;
        }
    };

    const getOrderStatusColor = (orderStatus) => {
        switch (orderStatus) {
            case "confirmed":
            case "delivered":
                return "bg-green-500";
            case "cancelled":
            case "rejected":
                return "bg-red-600";
            case "processing":
            case "shipped":
                return "bg-blue-500";
            case "pending":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatCurrency = (amount) => {
        if (!amount) return '';

        const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);

        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    return (
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Mã đơn hàng</p>
                        <Label className="text-sm break-all">{orderDetails?._id}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Ngày đặt hàng</p>
                        <Label>{orderDetails?.orderDate ? new Date(orderDetails.orderDate).toLocaleDateString('vi-VN') : 'N/A'}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Tổng tiền</p>
                        <Label className="font-semibold text-lg">{formatCurrency(orderDetails?.totalAmount)}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Phương thức thanh toán</p>
                        <Label>{getPaymentMethodDisplay(orderDetails?.paymentMethod)}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Trạng thái thanh toán</p>
                        <Label>
                            <Badge className={`py-1 px-3 ${orderDetails?.paymentStatus === "paid"
                                ? "bg-green-500"
                                : orderDetails?.paymentStatus === "failed"
                                    ? "bg-red-600"
                                    : "bg-yellow-500"
                                }`}>
                                {getPaymentStatusDisplay(orderDetails?.paymentStatus)}
                            </Badge>
                        </Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Trạng thái đơn hàng</p>
                        <Label>
                            <Badge className={`py-1 px-3 ${getOrderStatusColor(orderDetails?.orderStatus)}`}>
                                {getOrderStatusDisplay(orderDetails?.orderStatus)}
                            </Badge>
                        </Label>
                    </div>
                </div>

                {/* Thông tin chuyển khoản ngân hàng */}
                {orderDetails?.paymentMethod === "bank_transfer" && orderDetails?.paymentStatus === "pending" && (
                    <>
                        <Separator />
                        <Card className="bg-blue-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-800">Thông tin chuyển khoản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngân hàng:</span>
                                    <span>Vietcombank</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Số tài khoản:</span>
                                    <span className="font-mono">0591000367726</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Tên tài khoản:</span>
                                    <span>NGUYEN VAN DAT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Số tiền:</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(orderDetails?.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Nội dung CK:</span>
                                    <span className="font-mono text-red-600">DH{orderDetails?._id?.slice(-6)}</span>
                                </div>
                                <div className="mt-3 p-2 bg-yellow-100 rounded border-l-4 border-yellow-500">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng số tiền và ghi đúng nội dung để đơn hàng được xử lý nhanh chóng.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Thông tin chuyển khoản đã thực hiện */}
                {orderDetails?.paymentMethod === "bank_transfer" && orderDetails?.bankTransferInfo && (
                    <>
                        <Separator />
                        <Card className="bg-green-50 border-green-200">
                            <CardHeader>
                                <CardTitle className="text-green-800">Thông tin chuyển khoản đã thực hiện</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">Mã giao dịch:</span>
                                    <span className="font-mono">{orderDetails.bankTransferInfo.transactionId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Số tiền đã chuyển:</span>
                                    <span>{orderDetails.bankTransferInfo.transferAmount?.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Ngày chuyển:</span>
                                    <span>{new Date(orderDetails.bankTransferInfo.transferDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                                {orderDetails.bankTransferInfo.transferNote && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Ghi chú:</span>
                                        <span>{orderDetails.bankTransferInfo.transferNote}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Thông tin COD */}
                {orderDetails?.paymentMethod === "cod" && (
                    <>
                        <Separator />
                        <Card className="bg-orange-50 border-orange-200">
                            <CardHeader>
                                <CardTitle className="text-orange-800">Thanh toán khi nhận hàng (COD)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-orange-700">
                                    Bạn sẽ thanh toán <strong>{formatCurrency(orderDetails?.totalAmount)}</strong> khi nhận được hàng.
                                </p>
                                {orderDetails?.deliveryDate && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Đã giao hàng vào: {new Date(orderDetails.deliveryDate).toLocaleDateString('vi-VN')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Chi tiết sản phẩm</div>
                        <ul className="grid gap-3">
                            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                                ? orderDetails?.cartItems.map((item, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                        <div className="flex-1">
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span>SL: {item.quantity}</span>
                                            <span className="font-medium">{formatCurrency(item.price)}</span>
                                        </div>
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                </div>

                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Thông tin giao hàng</div>
                        <div className="grid gap-1 text-sm bg-gray-50 p-3 rounded">
                            <div><strong>Người nhận:</strong> {user?.userName}</div>
                            <div><strong>Địa chỉ:</strong> {orderDetails?.addressInfo?.address}</div>
                            <div><strong>Thành phố:</strong> {orderDetails?.addressInfo?.city}</div>
                            <div><strong>Mã bưu điện:</strong> {orderDetails?.addressInfo?.pincode}</div>
                            <div><strong>Số điện thoại:</strong> {orderDetails?.addressInfo?.phone}</div>
                            {orderDetails?.addressInfo?.notes && (
                                <div><strong>Ghi chú:</strong> {orderDetails.addressInfo.notes}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}

export default ShoppingOrderDetailsView;