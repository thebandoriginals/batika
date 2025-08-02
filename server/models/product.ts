import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    images: [String],
    sizes: [String],
    colors: [String],
    categories: [String],
}, { timestamps: true });

const Product = mongoose.model('Produc', productSchema);

export default Product;