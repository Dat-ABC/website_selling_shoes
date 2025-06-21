import Cart from '../../models/Cart.js'
import Product from '../../models/Product.js';
import mongoose from 'mongoose';


const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, color, size } = req.body;

        // Find product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        // Verify variant exists and has stock
        const variant = product.variants.find(v => v.color === color && v.size === size);
        if (!variant) {
            return res.status(400).json({ success: false, message: 'Biến thể không tồn tại' });
        }
        if (variant.stock < quantity) {
            return res.status(400).json({ success: false, message: 'Không đủ số lượng trong kho' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [], totalAmount: 0 });
        }

        // Find exact variant in cart
        const existingItemIndex = cart.items.findIndex(item =>
            item.productId.toString() === productId &&
            item.color === color &&
            item.size === size
        );

        if (existingItemIndex > -1) {
            // Update only the specific variant's quantity
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (newQuantity > variant.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Không thể thêm. Đã có ${cart.items[existingItemIndex].quantity} sản phẩm trong giỏ. Kho chỉ còn ${variant.stock} sản phẩm.`
                });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new variant as separate item
            cart.items.push({
                productId,
                title: product.title,
                price: product.price,
                color,
                size,
                quantity,
                image: product.image
            });
        }

        // Recalculate total
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        return res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Add to cart error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                data: {
                    items: [],
                    totalAmount: 0
                }
            });
        }

        // Populate product details and filter valid items
        const validItems = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Check if variant still exists
                const variant = product.variants.find(
                    v => v.color === item.color && v.size === item.size
                );

                if (variant) {
                    validItems.push({
                        productId: product._id,
                        title: product.title,
                        image: product.image,
                        price: product.price,
                        salePrice: product.salePrice,
                        color: item.color,
                        size: item.size,
                        quantity: item.quantity,
                        maxQuantity: variant.stock
                    });
                }
            }
        }

        // Update cart if invalid items were removed
        if (validItems.length < cart.items.length) {
            cart.items = validItems;
            cart.totalAmount = validItems.reduce(
                (total, item) => total + (item.price * item.quantity),
                0
            );
            await cart.save();
        }

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: validItems
            }
        });
    } catch (error) {
        console.error('Fetch cart error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const updateCartItemQty = async (req, res) => {
    try {
        const { userId, productId, quantity, color, size } = req.body;

        if (!userId || !productId || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin cần thiết"
            });
        }

        const [cart, product] = await Promise.all([
            Cart.findOne({ userId }),
            Product.findById(productId)
        ]);

        if (!cart || !product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy giỏ hàng hoặc sản phẩm"
            });
        }

        // Tìm biến thể phù hợp (nếu có color/size thì so sánh, nếu không thì bỏ qua)
        const variant = product.variants.find(
            v =>
                (color ? v.color === color : true) &&
                (size ? v.size === size : true)
        );

        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy biến thể sản phẩm"
            });
        }

        if (quantity > variant.stock) {
            return res.status(400).json({
                success: false,
                message: `Chỉ còn ${variant.stock} sản phẩm trong kho`
            });
        }

        // Tìm item trong giỏ hàng (nếu có color/size thì so sánh, nếu không thì bỏ qua)
        const itemIndex = cart.items.findIndex(item =>
            item.productId.toString() === productId &&
            (color ? item.color === color : true) &&
            (size ? item.size === size : true)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm trong giỏ hàng"
            });
        }

        cart.items[itemIndex].quantity = quantity;

        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Update cart error:', error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

const deleteCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const { color, size } = req.query;

        if (!userId || !productId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin cần thiết"
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy giỏ hàng"
            });
        }

        // Tìm item cần xóa (nếu có color/size thì so sánh, nếu không thì bỏ qua)
        const itemIndex = cart.items.findIndex(item =>
            item.productId.toString() === productId &&
            (color ? item.color === color : true) &&
            (size ? item.size === size : true)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm trong giỏ hàng"
            });
        }

        cart.items.splice(itemIndex, 1);

        cart.totalAmount = cart.items.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        );

        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Delete cart item error:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

export {
    addToCart,
    fetchCartItems,
    deleteCartItem,
    updateCartItemQty,
};
