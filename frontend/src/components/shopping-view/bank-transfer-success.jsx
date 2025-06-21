import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CheckCircle, Copy, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function BankTransferSuccessPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { bankAccountInfo, orderId } = useSelector((state) => state.shopOrder);
    const [copied, setCopied] = useState(false);

    // Lấy thông tin từ state hoặc từ sessionStorage
    const orderData = location.state?.orderData || null;
    const currentOrderId = orderId || JSON.parse(sessionStorage.getItem("currentOrderId") || "null");

    const bankInfo = bankAccountInfo || {
        bankName: "Vietcombank",
        accountNumber: "0591000367726",
        accountName: "NGUYEN VAN DAT",
        transferContent: `DH${currentOrderId?.slice(-6) || ""}`,
        amount: orderData?.totalAmount || 0,
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '0 ₫';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    const copyAllInfo = () => {
        const allInfo = `Ngân hàng: ${bankInfo.bankName}
        Số tài khoản: ${bankInfo.accountNumber}
        Tên tài khoản: ${bankInfo.accountName}
        Số tiền: ${formatCurrency(bankInfo.amount)}
        Nội dung: ${bankInfo.transferContent}`;

        copyToClipboard(allInfo);
    };

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
                        Đơn hàng của bạn đã được tạo. Vui lòng chuyển khoản theo thông tin bên dưới.
                    </p>
                </CardHeader>
            </Card>

            <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                        <CreditCard className="h-5 w-5" />
                        Thông tin chuyển khoản
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4">
                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                                <span className="font-medium text-gray-700">Ngân hàng:</span>
                                <p className="text-lg font-bold text-blue-600">{bankInfo.bankName}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div className="flex-1">
                                <span className="font-medium text-gray-700">Số tài khoản:</span>
                                <p className="text-lg font-mono font-bold">{bankInfo.accountNumber}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(bankInfo.accountNumber)}
                                className="ml-2"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div>
                                <span className="font-medium text-gray-700">Tên tài khoản:</span>
                                <p className="text-lg font-bold">{bankInfo.accountName}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div className="flex-1">
                                <span className="font-medium text-gray-700">Số tiền:</span>
                                <p className="text-xl font-bold text-red-600">
                                    {formatCurrency(bankInfo.amount)}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(formatCurrency(bankInfo.amount))}
                                className="ml-2"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-white rounded border">
                            <div className="flex-1">
                                <span className="font-medium text-gray-700">Nội dung chuyển khoản:</span>
                                <p className="text-lg font-mono font-bold text-red-600">
                                    {bankInfo.transferContent}
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(bankInfo.transferContent)}
                                className="ml-2"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4">
                        <Button onClick={copyAllInfo} className="w-full">
                            <Copy className="h-4 w-4 mr-2" />
                            Sao chép tất cả thông tin
                        </Button>
                    </div>

                    {copied && (
                        <div className="text-center">
                            <Badge className="bg-green-500">
                                Đã sao chép!
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-6 border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold text-yellow-800">Lưu ý quan trọng:</h3>
                        <ul className="text-sm text-yellow-700 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Vui lòng chuyển khoản đúng số tiền và ghi đúng nội dung để đơn hàng được xử lý nhanh chóng.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Đơn hàng sẽ được xử lý trong vòng 1-2 giờ sau khi nhận được thanh toán.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-600">•</span>
                                Nếu có vấn đề, vui lòng liên hệ hotline: 0335689355
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

export default BankTransferSuccessPage;