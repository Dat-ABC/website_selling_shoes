import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
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

const OrderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    cartItems: [orderItemSchema],
    addressInfo: {
        addressId: String,
        address: String,
        city: String,
        pincode: String,
        phone: String,
        notes: String,
    },
    orderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
});

export default mongoose.model("Order", OrderSchema);