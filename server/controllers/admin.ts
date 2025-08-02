import { NextFunction, Response } from "express";
import HttpError from "../models/http-error";
import { TokenRequest } from "../utils/types";
import { validationResult } from "express-validator";
import { checkCategorySlugExistence, checkProductSlugExistence } from "../middleware/check-unique-credentials";
import Category from "../models/category";
import Product from "../models/product";
import Order from "../models/order";

export const addCategory = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { name, slug, parent, image } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422))
        };
        const isSlugExisting = await checkCategorySlugExistence(slug?.trim());
        if (isSlugExisting) return next(new HttpError('Category error', 'The slug already exists', 422));
        const newCategory = new Category({ name: name?.trim(), slug: slug?.trim(), parent, image }) as any;
        await newCategory.save();
        res.status(200).json({ message: 'Category created', category: newCategory['_doc'] });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to add category'));
    }
}

export const editCategory = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { _id, name, slug, parent, image } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422))
        };
        const foundCategory = await Category.findById(_id);
        if (!foundCategory) return next(new HttpError('Category error', 'Category Not Found', 404));
        const isSlugExisting = await checkCategorySlugExistence(slug?.trim(), _id);
        if (isSlugExisting) return next(new HttpError('Category error', 'The slug already exists', 422));
        await Category.updateOne({ _id }, { $set: { name: name?.trim(), slug: slug?.trim(), parent, image } });
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to edit category'));
    }
}

export const deleteCategory = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { _id } = req.params;
        const foundCategory = await Category.findById(_id);
        if (!foundCategory) return next(new HttpError('Category error', 'Category Not Found', 404));
        await Category.deleteOne({ _id });
        res.status(200).json({ message: 'Category removed' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to delete category'));
    }
}

export const addProduct = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { name, slug, price, images, sizes, colors, categories } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422));
        }
        const productSlugExisting = await checkProductSlugExistence(slug?.trim());
        if (productSlugExisting) return next(new HttpError('Product error', 'The product slug already exists', 422));
        const newProduct = new Product({ name: name?.trim(), slug: slug?.trim(), price, images, sizes, colors, categories }) as any;
        await newProduct.save();
        res.status(200).json({ message: 'product created', product: newProduct['_doc'] });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to add product'))
    }
}

export const editProduct = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { _id, name, slug, price, images, sizes, colors, categories } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422));
        }
        const foundProduct = await Product.findById(_id);
        if (!foundProduct) return next(new HttpError('Product Error', 'Product Not Found', 404));
        const productSlugExisting = await checkProductSlugExistence(slug?.trim(), _id);
        if (productSlugExisting) return next(new HttpError('Product error', 'The product slug already exists', 422));
        await Product.updateOne({ _id }, { $set: { name: name?.trim(), slug: slug?.trim(), price, images, sizes, colors, categories } });
        res.status(200).json({ message: "Product updated" });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to edit product'))
    }
}

export const deleteProduct = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { _id } = req.params;
        const foundProduct = await Product.findById(_id);
        if (!foundProduct) return next(new HttpError('Product error', 'Product not found', 404));
        await Product.deleteOne({ _id });
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to delete product'));
    }
}

export const getOrders = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }) as any;
        res.status(200).json({ message: 'Orders', orders });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get orders'));
    }
}

export const singleOrder = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findById(req.params._id) as any;
        if (!order) return next(new HttpError('Order Error', 'Order Not Found', 404));
        res.status(200).json({ message: 'Order Found', order: order['_doc'] })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get single order'));
    }
}

export const changeOrderStatus = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { status, orderId } = req.body;
        const foundOrder = await Order.findById(orderId);
        if (!foundOrder) return next(new HttpError('Order Error', 'Order Not Found', 404));
        await Order.updateOne({ _id: orderId }, { $set: { status } });
        res.status(200).json({ message: 'Order status changed' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to change status'));
    }
}