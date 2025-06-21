import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, Truck, Clock } from "lucide-react";

function CODSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy thông tin đơn hàng từ state
    const orderData = location.state?.orderData || null;
    const orderId = JSON.parse(sessionStorage.getItem("currentOrderId") || "null");

    useEffect(() => {
        // Xóa thông tin đơn hàng khỏi sessionStorage sau 5 phút
        const timer = setTimeout(() => {
            sessionStorage.removeItem("currentOrderId");
        }, 5 * 60 * 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card className="mb-6">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-green-600">
                        Đặt hàng thành công!
                    </CardTitle>
                    <p className="text-gray-600">
                        Đơn hàng của bạn đã được xác nhận. Bạn sẽ thanh toán khi nhận hàng.
                    </p>
                </CardHeader>
            </Card>

            <Card className="mb-6 border-orange-200 bg-orange-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                        <Truck className="h-5 w-5" />
                        Thông tin giao hàng
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        {orderId && (
                            <div className="p-3 bg-white rounded border">
                                <span className="font-medium text-gray-700">Mã đơn hàng:</span>
                                <p className="text-lg font-mono font-bold text-orange-600">
                                    {orderId.slice(-8)}...
                                </p>
                            </div>
                        )}

                        {orderData?.totalAmount && (
                            <div className="p-3 bg-white rounded border">
                                <span className="font-medium text-gray-700">Số tiền thanh toán khi nhận hàng:</span>
                                <p className="text-xl font-bold text-red-600">
                                    {orderData.totalAmount.toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        )}

                        <div className="p-3 bg-white rounded border">
                            <span className="font-medium text-gray-700">Thời gian giao hàng dự kiến:</span>
                            <p className="text-lg font-semibold text-blue-600">
                                2-3 ngày làm việc
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Quy trình giao hàng COD:
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Xác nhận đơn hàng</p>
                                    <p className="text-sm text-blue-600">Chúng tôi sẽ gọi điện xác nhận đơn hàng trong 1-2 giờ</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Chuẩn bị hàng</p>
                                    <p className="text-sm text-blue-600">Đóng gói và chuẩn bị giao hàng</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-blue-800">Giao hàng</p>
                                    <p className="text-sm text-blue-600">Shipper sẽ liên hệ trước khi giao hàng</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </div>
                                <div>
                                    <p className="font-medium text-green-800">Thanh toán</p>
                                    <p className="text-sm text-green-600">Thanh toán tiền mặt khi nhận hàng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-yellow-800">Lưu ý quan trọng:</h3>
                        <ul className="text-sm text-yellow-700 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Vui lòng chuẩn bị đủ tiền mặt khi nhận hàng.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Kiểm tra kỹ hàng hóa trước khi thanh toán.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Nếu có vấn đề, vui lòng liên hệ hotline: 1900-xxxx
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Đơn hàng có thể bị hủy nếu không liên lạc được sau 3 lần gọi.
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate("/shop/account")}
                    className="flex-1"
                >
                    Xem đơn hàng
                </Button>
                <Button
                    onClick={() => navigate("/shop/listing")}
                    className="flex-1"
                >
                    Tiếp tục mua sắm
                </Button>
            </div>
        </div>
    );
}

export default CODSuccessPage;