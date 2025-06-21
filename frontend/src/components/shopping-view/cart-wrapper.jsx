import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        if (!amount) return '0 ₫';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    const totalCartAmount =
        cartItems && cartItems.length > 0
            ? cartItems.reduce(
                (sum, currentItem) =>
                    sum +
                    (currentItem?.salePrice > 0
                        ? currentItem?.salePrice
                        : currentItem?.price) *
                    currentItem?.quantity,
                0
            )
            : 0;

    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Giỏ hàng</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {cartItems && cartItems.length > 0
                    ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
                    : null}
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Tổng</span>
                    <span className="font-bold">{formatCurrency(totalCartAmount)}</span>
                </div>
            </div>
            <Button
                onClick={() => {
                    navigate("/shop/checkout");
                    setOpenCartSheet(false);
                }}
                className="w-full mt-6"
            >
                Thanh toán
            </Button>
        </SheetContent>
    );
}

export default UserCartWrapper;
