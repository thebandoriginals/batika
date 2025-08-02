import mongoose from "mongoose";

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    reference: { type: String, required: true },
    amount: { type: Number, required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;