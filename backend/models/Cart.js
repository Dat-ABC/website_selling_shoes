import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    title: String,
    price: Number,
    color: String,
    size: String,
    quantity: Number,
    image: String
});

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [cartItemSchema],
        totalAmount: Number
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Cart", CartSchema);
