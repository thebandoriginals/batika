import mongoose from "mongoose";

const Schema = mongoose.Schema;

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

const User = mongoose.model('User', userSchema);

export default User;