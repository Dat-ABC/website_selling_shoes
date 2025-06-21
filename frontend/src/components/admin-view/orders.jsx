import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent } from "../ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllOrdersForAdmin,
    getOrderDetailsForAdmin,
    resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const { orderList, orderDetails } = useSelector((state) => state.adminOrder);

    console.log("orderList", orderList)

    const dispatch = useDispatch();

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    function handleFetchOrderDetails(orderId) {
        setSelectedOrderId(orderId);
        dispatch(getOrderDetailsForAdmin(orderId));
    }

    function handleCloseDialog() {
        setOpenDetailsDialog(false);
        setSelectedOrderId(null);
        dispatch(resetOrderDetails());
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    useEffect(() => {
        // Chỉ mở dialog khi có orderDetails và orderId khớp với đơn hàng được chọn
        if (orderDetails !== null && selectedOrderId && orderDetails._id === selectedOrderId) {
            setOpenDetailsDialog(true);
        }
    }, [orderDetails, selectedOrderId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lịch sử đặt hàng</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn hàng</TableHead>
                            <TableHead>Ngày đặt hàng</TableHead>
                            <TableHead>Nội dung</TableHead>
                            <TableHead>Trạng thái đơn hàng</TableHead>
                            <TableHead>Trạng thái thanh toán</TableHead>
                            <TableHead>Giá đặt hàng</TableHead>
                            <TableHead>
                                <span className="sr-only">Chi tiết</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0
                            ? orderList.map((orderItem) => (
                                <TableRow key={orderItem._id}>
                                    {console.log("orderItem:", {
                                        id: orderItem._id,
                                        title: orderItem.title,
                                        // price: orderItem.price,
                                        color: orderItem.cartItems.color,
                                        // size: orderItem.size,
                                        // quantity: orderItem.quantity,
                                        variant: orderItem.cartItems

                                    })}
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            {orderItem.cartItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    {/* <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-12 h-12 object-cover"
                                                    /> */}
                                                    <div>
                                                        <p className="font-medium">{item.title}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Màu: {item?.color}, Size: {item?.size}
                                                        </p>
                                                        <p className="text-sm">
                                                            {formatCurrency(item?.price)} x {item?.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${orderItem?.orderStatus === "confirmed" || orderItem?.orderStatus === "delivered"
                                                ? "bg-green-500"
                                                : orderItem?.orderStatus === "rejected"
                                                    ? "bg-red-600"
                                                    : "bg-blue-500"
                                                }`}
                                        >
                                            {getOrderStatusDisplay(orderItem?.orderStatus)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${orderItem?.paymentStatus === "paid"
                                                ? "bg-green-500"
                                                : orderItem?.paymentStatus === "failed" || orderItem?.paymentStatus === "cancelled"
                                                    ? "bg-red-600"
                                                    : orderItem?.paymentStatus === "refunded"
                                                        ? "bg-orange-500"
                                                        : "bg-yellow-500"
                                                }`}
                                        >
                                            {getPaymentStatusDisplay(orderItem?.paymentStatus)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatCurrency(orderItem?.totalAmount)}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleFetchOrderDetails(orderItem?._id)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                            : null}
                    </TableBody>
                </Table>

                {/* Dialog với khả năng cuộn */}
                <Dialog open={openDetailsDialog} onOpenChange={handleCloseDialog}>
                    {/* <DialogContent className="max-w-4xl max-h-[60vh] overflow-y-auto"> */}
                    {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} />}
                    {/* </DialogContent> */}
                </Dialog>
            </CardContent>
        </Card>
    );
}

export default AdminOrdersView;