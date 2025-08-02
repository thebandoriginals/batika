"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const transactionSchema = new Schema({
    reference: { type: String, required: true },
    amount: { type: Number, required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
}, { timestamps: true });
const Transaction = mongoose_1.default.model('Transaction', transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=transaction.js.map