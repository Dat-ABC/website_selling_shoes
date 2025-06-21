import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { deleteCartItem } from "@/store/shop/cart-slice";

function ShoppingCheckout() {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user } = useSelector((state) => state.auth);
    const { approvalURL } = useSelector((state) => state.shopOrder);
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
    const [isPaymentStart, setIsPaymemntStart] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalCartAmount =
        cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price) *
                    currentItem?.quantity,
                0
            )
            : 0;

    function validateOrder() {
        if (!cartItems || !cartItems.items || cartItems.items.length === 0) {
            toast.warning("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để tiếp tục");
            return false;
        }
        if (currentSelectedAddress === null) {
            toast.warning("Vui lòng chọn một địa chỉ để tiếp tục");
            return false;
        }
        return true;
    }

    function createOrderData(paymentMethod) {
        return {
            userId: user?.id,
            cartId: cartItems?._id,
            cartItems: cartItems.items.map((singleCartItem) => ({
                productId: singleCartItem?.productId,
                title: singleCartItem?.title,
                image: singleCartItem?.image,
                price:
                    singleCartItem?.salePrice > 0
                        ? singleCartItem?.salePrice
                        : singleCartItem?.price,
                quantity: singleCartItem?.quantity,
                color: singleCartItem?.color,
                size: singleCartItem?.size
            })),
            addressInfo: {
                addressId: currentSelectedAddress?._id,
                address: currentSelectedAddress?.address,
                city: currentSelectedAddress?.city,
                pincode: currentSelectedAddress?.pincode,
                phone: currentSelectedAddress?.phone,
                notes: currentSelectedAddress?.notes,
            },
            orderStatus: "pending",
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
            totalAmount: totalCartAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: "",
            payerId: "",
        };
    }

    function handleBankTransferPayment() {
        if (!validateOrder()) return;

        setIsPaymemntStart(true);
        const orderData = createOrderData("bank_transfer");

        dispatch(createNewOrder(orderData)).then(async (data) => {
            setIsPaymemntStart(false);
            if (data?.payload?.success) {
                for (const item of orderData.cartItems) {
                    await dispatch(deleteCartItem({
                        userId: orderData.userId,
                        productId: item.productId,
                        color: item.color,
                        size: item.size
                    }));
                }
                navigate("/shop/bank-transfer-success", { state: { orderData } });
            } else {
                toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
            }
        });
    }

    function handleCODPayment() {
        if (!validateOrder()) return;

        setIsPaymemntStart(true);
        const orderData = createOrderData("cod");

        dispatch(createNewOrder(orderData)).then(async (data) => {
            setIsPaymemntStart(false);
            if (data?.payload?.success) {
                for (const item of orderData.cartItems) {
                    await dispatch(deleteCartItem({
                        userId: orderData.userId,
                        productId: item.productId,
                        color: item.color,
                        size: item.size
                    }));
                }
                navigate("/shop/cod-success", { state: { orderData } });
            } else {
                toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
            }
        });
    }

    const formatCurrency = (amount) => {
        if (!amount) return '0 ₫';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    if (approvalURL) {
        window.location.href = approvalURL;
    }

    return (
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} className="h-full w-full object-cover object-center" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
                <Address
                    selectedId={currentSelectedAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
                <div className="flex flex-col gap-4">
                    {cartItems && cartItems.items && cartItems.items.length > 0
                        ? cartItems.items.map((item, index) => (
                            <UserCartItemsContent key={index} cartItem={item} />
                        ))
                        : null}
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between">
                            <span className="font-bold">Tổng cộng</span>
                            <span className="font-bold">{formatCurrency(totalCartAmount)}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-medium mb-3">Chọn phương thức thanh toán:</h3>
                        <div className="space-y-3">
                            <Button
                                onClick={handleBankTransferPayment}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={isPaymentStart}
                            >
                                {isPaymentStart && selectedPaymentMethod === "bank_transfer"
                                    ? "Đang xử lý..."
                                    : "Thanh toán chuyển khoản ngân hàng"}
                            </Button>

                            <Button
                                onClick={handleCODPayment}
                                className="w-full bg-orange-500 hover:bg-orange-600"
                                disabled={isPaymentStart}
                            >
                                {isPaymentStart && selectedPaymentMethod === "cod"
                                    ? "Đang xử lý..."
                                    : "Thanh toán khi nhận hàng (COD)"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCheckout;
