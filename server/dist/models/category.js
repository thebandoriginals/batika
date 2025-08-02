"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, content: Schema.Types.Mixed },
    parent: { type: String, content: Schema.Types.Mixed },
}, { timestamps: true });
const Category = mongoose_1.default.model('Category', categorySchema);
exports.default = Category;
//# sourceMappingURL=category.js.map