import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { use, useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { toast } from "sonner";
import { DialogTitle } from "@radix-ui/react-dialog";
import { checkUserPurchase } from "@/store/shop/order-slice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    const [reviewMsg, setReviewMsg] = useState("");
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { reviews } = useSelector((state) => state.shopReview);

    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [availableStock, setAvailableStock] = useState(0);

    function handleRatingChange(getRating) {
        console.log(getRating, "getRating");
        setRating(getRating);
    }

    // FIX 1: Sửa lại hàm handleAddToCart để không cần tham số
    function handleAddToCart() {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
            return;
        }

        if (!productDetails?._id) {
            toast.error("Không tìm thấy thông tin sản phẩm");
            return;
        }

        // Kiểm tra nếu có variants thì phải chọn color và size
        if (productDetails?.variants?.length > 0) {
            if (colors.length > 0 && !selectedColor) {
                toast.error("Vui lòng chọn màu sắc");
                return;
            }
            if (sizes.length > 0 && !selectedSize) {
                toast.error("Vui lòng chọn kích thước");
                return;
            }
        }

        let getCartItems = cartItems.items || [];
        const currentStock = availableStock || productDetails?.totalStock || 0;

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(
                (item) => item.productId === productDetails._id
            );
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > currentStock) {
                    toast.error(`Chỉ có thể thêm số lượng ${getQuantity} cho mặt hàng này`);
                    return;
                }
            }
        }

        dispatch(
            addToCart({
                userId: user?.id,
                productId: productDetails?._id,
                quantity: 1,
                color: selectedColor,
                size: selectedSize
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast.success("Sản phẩm đã được thêm vào giỏ hàng");
            }
        });
    }

    function handleDialogClose() {
        setOpen(false);
        dispatch(setProductDetails());
        setRating(0);
        setReviewMsg("");
    }

    function handleAddReview() {
        // First check if user has purchased this product
        dispatch(checkUserPurchase(user?.id, productDetails?.id)).then((result) => {
            if (!result.payload.hasPurchased) {
                toast.error("Bạn phải mua hàng mới được đánh giá");
                return;
            }

            // If user has purchased, proceed with adding review
            dispatch(
                addReview({
                    productId: productDetails?.id,
                    userId: user?.id,
                    userName: user?.userName,
                    reviewMessage: reviewMsg,
                    reviewValue: rating,
                })
            ).then((data) => {
                if (data.payload.success) {
                    setRating(0);
                    setReviewMsg("");
                    dispatch(getReviews(productDetails?.id));
                    toast.success("Đã thêm đánh giá thành công!");
                } else {
                    toast.error(data.payload.message || "Có lỗi xảy ra khi thêm đánh giá");
                }
            }).catch((error) => {
                toast.error("Có lỗi xảy ra khi thêm đánh giá");
            });
        });
    }

    // FIX 2: Cập nhật logic xử lý variants
    useEffect(() => {
        if (productDetails?.variants?.length > 0) {
            // Filter out empty strings for colors and sizes
            const uniqueColors = Array.from(
                new Set(
                    productDetails.variants
                        .map(v => v.color)
                        .filter(color => color && color.trim() !== "")
                )
            );

            const uniqueSizes = Array.from(
                new Set(
                    productDetails.variants
                        .map(v => v.size)
                        .filter(size => size && size.trim() !== "")
                )
            );

            setColors(uniqueColors);
            setSizes(uniqueSizes);

            // Reset selections when product changes
            setSelectedColor('');
            setSelectedSize('');

            // Only set initial values if arrays are not empty
            if (uniqueColors.length > 0) {
                setSelectedColor(uniqueColors[0]);
            }
            if (uniqueSizes.length > 0) {
                setSelectedSize(uniqueSizes[0]);
            }
        } else {
            setColors([]);
            setSizes([]);
            setSelectedColor('');
            setSelectedSize('');
            setAvailableStock(productDetails?.totalStock || 0);
        }
    }, [productDetails]);

    // FIX 3: Tách riêng effect để update stock
    useEffect(() => {
        if (productDetails?.variants?.length > 0) {
            // Update available stock based on selected variant
            const variant = productDetails.variants.find(
                v => (colors.length === 0 || v.color === selectedColor) &&
                    (sizes.length === 0 || v.size === selectedSize)
            );
            setAvailableStock(variant?.stock || 0);
        }
    }, [selectedColor, selectedSize, productDetails, colors, sizes]);

    useEffect(() => {
        if (productDetails !== null) dispatch(getReviews(productDetails?._id));
    }, [productDetails]);

    const formatCurrency = (amount) => {
        if (!amount) return '0 ₫';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(numAmount);
    };

    const averageReview =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
            reviews.length
            : 0;

    // FIX 4: Đơn giản hóa logic disabled
    const isAddToCartDisabled = () => {
        if (productDetails?.totalStock === 0) return true;
        if (productDetails?.variants?.length > 0) {
            if (colors.length > 0 && !selectedColor) return true;
            if (sizes.length > 0 && !selectedSize) return true;
            if (availableStock === 0) return true;
        }
        return false;
    };

    const getAddToCartButtonText = () => {
        if (productDetails?.totalStock === 0) return "Hết hàng";
        if (colors.length > 0 && !selectedColor) return "Vui lòng chọn màu sắc";
        if (sizes.length > 0 && !selectedSize) return "Vui lòng chọn kích thước";
        if (productDetails?.variants?.length > 0 && availableStock === 0) return "Hết hàng cho lựa chọn này";
        return "Thêm vào giỏ hàng";
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid md:grid-cols-2 gap-6 p-6 max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">
                    {productDetails?.title || 'Chi tiết sản phẩm'}
                </DialogTitle>

                <div className="overflow-hidden rounded-lg h-[300px] md:h-[450px]">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="flex flex-col h-full">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground">{productDetails?.description}</p>
                    </div>

                    {/* Price section */}
                    <div className="flex justify-between items-center mt-4">
                        <p className={`text-2xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>
                            {formatCurrency(productDetails?.price)}
                        </p>
                        {productDetails?.salePrice > 0 && (
                            <p className="text-xl font-bold text-muted-foreground">
                                {formatCurrency(productDetails?.salePrice)}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 items-center mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={averageReview} />
                        </div>
                        <span className="text-muted-foreground">
                            ({averageReview.toFixed(2)})
                        </span>
                    </div>

                    <div className="mt-5 mb-5">
                        <div className="space-y-6">
                            {/* FIX 5: Cải thiện UI cho color selection */}
                            {colors.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Màu sắc</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    console.log('Color clicked:', color); // Debug log
                                                    setSelectedColor(color);
                                                }}
                                                className={`px-4 py-2 border rounded-md transition-all cursor-pointer ${selectedColor === color
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-accent hover:text-accent-foreground border-gray-300'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedColor && (
                                        <p className="text-sm text-muted-foreground">
                                            Đã chọn: {selectedColor}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* FIX 6: Cải thiện UI cho size selection */}
                            {sizes.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Kích thước</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    console.log('Size clicked:', size); // Debug log
                                                    setSelectedSize(size);
                                                }}
                                                className={`px-4 py-2 border rounded-md transition-all cursor-pointer ${selectedSize === size
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-accent hover:text-accent-foreground border-gray-300'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                    {selectedSize && (
                                        <p className="text-sm text-muted-foreground">
                                            Đã chọn: {selectedSize}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Stock info */}
                            {/*productDetails?.variants?.length > 0 && selectedColor && selectedSize && (
                                <p className="text-sm text-muted-foreground">
                                    Còn lại: {availableStock} sản phẩm
                                </p>
                            )*/}

                            <Button
                                className="w-full"
                                onClick={handleAddToCart}
                                disabled={isAddToCartDisabled()}
                            >
                                {getAddToCartButtonText()}
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="mt-4 max-h-[250px] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-2">Đánh giá</h2>
                        <div className="grid gap-6">
                            {reviews && reviews.length > 0 ? (
                                reviews.map((reviewItem) => (
                                    <div key={reviewItem._id} className="flex gap-4">
                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>
                                                {reviewItem?.userName[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="flex gap-2 items-center">
                                                <h3 className="font-bold">{reviewItem?.userName}</h3>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <StarRatingComponent rating={reviewItem?.reviewValue} />
                                            </div>
                                            <p className="text-muted-foreground">
                                                {reviewItem.reviewMessage}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1>Không có đánh giá</h1>
                            )}
                        </div>
                        <div className="mt-auto pt-4 border-t">
                            <Label className="mb-2">Viết đánh giá</Label>
                            <div className="space-y-2">
                                <StarRatingComponent
                                    rating={rating}
                                    handleRatingChange={handleRatingChange}
                                />
                                <Input
                                    name="reviewMsg"
                                    value={reviewMsg}
                                    onChange={(event) => setReviewMsg(event.target.value)}
                                    placeholder="Viết đánh giá..."
                                />
                                <Button
                                    onClick={handleAddReview}
                                    disabled={reviewMsg.trim() === ""}
                                    className="w-full"
                                >
                                    Đánh giá
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;