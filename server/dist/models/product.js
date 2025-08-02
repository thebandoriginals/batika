"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const productSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    images: [String],
    sizes: [String],
    colors: [String],
    categories: [String],
}, { timestamps: true });
const Product = mongoose_1.default.model('Produc', productSchema);
exports.default = Product;
//# sourceMappingURL=product.js.map