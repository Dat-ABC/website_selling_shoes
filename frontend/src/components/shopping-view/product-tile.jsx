import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/components/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
    product,
    handleGetProductDetails,
    handleAddtoCart,
}) {
    const totalStock = product?.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;

    const formatCurrency = (amount) => {
        if (!amount) return '0 ₫';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    const getStockBadge = () => {
        if (totalStock === 0) {
            return (
                <Badge variant="destructive" className="absolute top-2 left-2">
                    Hết hàng
                </Badge>
            );
        }
        if (totalStock < 10) {
            return (
                <Badge variant="destructive" className="absolute top-2 left-2">
                    Chỉ còn {totalStock} sản phẩm
                </Badge>
            );
        }
        if (product?.salePrice > 0) {
            return (
                <Badge variant="destructive" className="absolute top-2 left-2">
                    Giảm giá
                </Badge>
            );
        }
        return null;
    };

    return (
        <Card className="w-full h-full flex flex-col overflow-hidden">
            <div
                className="cursor-pointer flex-grow"
                onClick={() => handleGetProductDetails(product?._id)}
            >
                <div className="relative aspect-square">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-full object-cover"
                    />
                    {getStockBadge()}
                </div>

                <CardContent className="p-4 space-y-3">
                    <h2 className="text-lg font-semibold line-clamp-2">
                        {product?.title}
                    </h2>

                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{categoryOptionsMap[product?.category]}</span>
                        <span>{brandOptionsMap[product?.brand]}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`text-lg font-medium ${product?.salePrice > 0 ? "line-through text-muted-foreground" : ""
                            }`}>
                            {formatCurrency(product?.price)}
                        </span>
                        {product?.salePrice > 0 && (
                            <span className="text-lg font-medium text-destructive">
                                {formatCurrency(product?.salePrice)}
                            </span>
                        )}
                    </div>
                </CardContent>
            </div>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full h-10"
                    disabled={totalStock === 0}
                    onClick={() => totalStock > 0 && handleAddtoCart(product?._id, totalStock)}
                >
                    {totalStock === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;