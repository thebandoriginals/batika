import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    number: { type: Number, required: true },
    customer: {
        _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
    },
    status: { type: String, default: 'Pending' },
    products: [{
        _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        images: [String],
        size: { type: String, content: Schema.Types.Mixed },
        color: { type: String, content: Schema.Types.Mixed },
        quantity: { type: Number, required: true },
    }],
    payment: {
        paid: { type: Boolean, default: false },
        reference: { type: String, content: Schema.Types.Mixed },
        amount: { type: Number, required: true },
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;