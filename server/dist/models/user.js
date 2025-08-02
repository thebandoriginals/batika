"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photoURL: { type: String, content: Schema.Types.Mixed },
    role: { type: String, default: 'user' },
    cart: [{
            _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            slug: { type: String, required: true },
            price: { type: Number, required: true },
            images: [String],
            size: { type: String, content: Schema.Types.Mixed },
            color: { type: String, content: Schema.Types.Mixed },
            quantity: { type: Number, required: true },
        }]
}, { timestamps: true });
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map