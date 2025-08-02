import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, content: Schema.Types.Mixed },
    parent: { type: String, content: Schema.Types.Mixed },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;