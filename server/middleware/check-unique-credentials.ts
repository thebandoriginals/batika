import Category from "../models/category";
import Product from "../models/product";
import User from "../models/user";

export const checkEmailExistence = async (email: string, id?: string) => {
    try {
        let foundUserWithEmail;
        if (!id) foundUserWithEmail = await User.findOne({ email });
        else if (id) foundUserWithEmail = await User.findOne({ $and: [{ _id: { $ne: id } }, { email }] });
        return (foundUserWithEmail)
    } catch (err) {
        console.log(err);
    }
};

export const checkCategorySlugExistence = async (slug: string, id?: string) => {
    let foundSlug;
    if (!id) foundSlug = await Category.findOne({ slug });
    else if (id) foundSlug = await Category.findOne({ $and: [{ _id: { $ne: id } }, { slug }] });
    return !!foundSlug
}

export const checkProductSlugExistence = async (slug: string, id?: string) => {
    let foundSlug;
    if (!id) foundSlug = await Product.findOne({ slug });
    else if (id) foundSlug = await Product.findOne({ $and: [{ _id: { $ne: id } }, { slug }] });
    return !!foundSlug
}