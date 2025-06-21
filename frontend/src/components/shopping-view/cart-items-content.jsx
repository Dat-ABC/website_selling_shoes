import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { productList } = useSelector((s) => s.shopProducts);

    // Find the corresponding product from productList
    const product = productList.find(p => p._id === cartItem.productId);

    // Find the specific variant
    const variant = product?.variants?.find(
        v => v.color === cartItem.color && v.size === cartItem.size
    );

    const formatCurrency = (amt) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amt || 0);
    };

    const handleUpdateQuantity = (actionType) => {
        if (!variant) {
            toast.error("Không tìm thấy thông tin biến thể");
            return;
        }

        const currentQty = cartItem.quantity;
        const newQty = actionType === "plus" ? currentQty + 1 : currentQty - 1;

        // Check stock limit
        if (actionType === "plus" && newQty > variant.stock) {
            toast.error(`Chỉ còn ${variant.stock} sản phẩm trong kho`);
            return;
        }

        dispatch(updateCartQuantity({
            userId: user.id,
            productId: cartItem.productId,
            color: cartItem.color,
            size: cartItem.size,
            quantity: newQty
        }));
    };

    const handleCartItemDelete = () => {
        dispatch(deleteCartItem({
            userId: user.id,
            productId: cartItem.productId,
            color: cartItem.color,
            size: cartItem.size
        }));
    };

    if (!cartItem || !product) return null;

    return (
        <div className="flex items-center space-x-4">
            <img
                src={cartItem.image}
                alt={cartItem.title}
                className="w-20 h-20 rounded object-cover"
            />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem.title}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                    <p>Màu sắc: <span className="font-medium">{cartItem.color}</span></p>
                    <p>Kích thước: <span className="font-medium">{cartItem.size}</span></p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled={cartItem.quantity <= 1}
                        onClick={() => handleUpdateQuantity("minus")}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold">{cartItem.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        disabled={variant && cartItem.quantity >= variant.stock}
                        onClick={() => handleUpdateQuantity("plus")}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    {formatCurrency(cartItem.price * cartItem.quantity)}
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCartItemDelete}
                    className="h-8 w-8 mt-1 text-destructive hover:text-destructive"
                >
                    <Trash size={20} />
                </Button>
            </div>
        </div>
    );
}

export default UserCartItemsContent;