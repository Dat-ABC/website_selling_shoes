import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllOrdersByUserId,
    getOrderDetails,
    resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetails(getId));
    }

    const getPaymentMethodDisplay = (paymentMethod) => {
        switch (paymentMethod) {
            case "bank_transfer":
                return "Chuyển khoản";
            case "cod":
                return "Thanh toán khi nhận hàng";
            default:
                return paymentMethod;
        }
    };

    const getOrderStatusDisplay = (orderStatus) => {
        switch (orderStatus) {
            case "pending":
                return "Chờ xử lý";
            case "confirmed":
                return "Đã xác nhận";
            case "inProcess":
                return "Đang xử lý";
            case "inShipping":
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

    const getPaymentStatusDisplay = (paymentStatus) => {
        switch (paymentStatus) {
            case "paid":
                return "Đã thanh toán";
            case "pending":
                return "Chờ thanh toán";
            case "failed":
                return "Thanh toán thất bại";
            case "cancelled":
                return "Đã hủy"
            case "refunded":
                return "Đã hoàn tiền"
            default:
                return paymentStatus;
        }
    };

    const getPaymentStatusColor = (paymentStatus) => {
        switch (paymentStatus) {
            case "paid":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "failed":
                return "bg-red-600";
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

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id));
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lịch sử đặt hàng</CardTitle>
            </CardHeader>
            <CardContent>
                {orderList && orderList.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn hàng</TableHead>
                                <TableHead>Ngày đặt hàng</TableHead>
                                <TableHead>Trạng thái đơn hàng</TableHead>
                                <TableHead>Trạng thái thanh toán</TableHead>
                                <TableHead>Phương thức thanh toán</TableHead>
                                <TableHead>Tổng tiền</TableHead>
                                <TableHead>
                                    <span className="sr-only">Chi tiết</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderList.map((orderItem) => (
                                <TableRow key={orderItem._id}>
                                    <TableCell className="font-mono text-xs">
                                        {orderItem._id.slice(-8)}...
                                    </TableCell>
                                    <TableCell>
                                        {new Date(orderItem.orderDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`py-1 px-3 ${getOrderStatusColor(orderItem?.orderStatus)}`}>
                                            {getOrderStatusDisplay(orderItem?.orderStatus)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`py-1 px-3 ${getPaymentStatusColor(orderItem?.paymentStatus)}`}>
                                            {getPaymentStatusDisplay(orderItem?.paymentStatus)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getPaymentMethodDisplay(orderItem?.paymentMethod)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatCurrency(orderItem?.totalAmount)}
                                    </TableCell>
                                    <TableCell>
                                        <Dialog
                                            open={openDetailsDialog}
                                            onOpenChange={() => {
                                                setOpenDetailsDialog(false);
                                                dispatch(resetOrderDetails());
                                            }}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleFetchOrderDetails(orderItem?._id)
                                                }
                                            >
                                                Xem chi tiết
                                            </Button>
                                            <ShoppingOrderDetailsView orderDetails={orderDetails} />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
                        <Button
                            onClick={() => window.location.href = '/shop/listing'}
                            variant="outline"
                        >
                            Bắt đầu mua sắm
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ShoppingOrders;