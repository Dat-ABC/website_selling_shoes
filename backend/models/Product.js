import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    color: { type: String },
    size: { type: String },
    stock: { type: Number, default: 0 }
});


const productSchema = new mongoose.Schema(
    {
        image: String,
        title: String,
        description: String,
        category: String,
        brand: String,
        price: Number,
        salePrice: Number,
        variants: [variantSchema],
        averageReview: Number,

    },
    { timestamps: true }
)

export default mongoose.model("Product", productSchema);