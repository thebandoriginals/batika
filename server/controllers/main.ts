import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import Category from "../models/category";
import Product from "../models/product";
import Order from "../models/order";
import { validationResult } from "express-validator/src";
import axios from "axios";

export const main = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: 'Batika' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to load server'))
    }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Categories found', categories });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get categories'));
    }
}

export const getSingleCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.query;
        const foundCategory = await Category.findOne({ slug }) as any;
        if (!foundCategory) return next(new HttpError('Category error', 'Category not found', 404));
        const foundProducts = await Product.find({ categories: foundCategory?.name }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Category found', category: foundCategory['_doc'], products: foundProducts })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get single category'))
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Products found', products });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get products'))
    }
}

export const getSingleProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.query;
        const product = await Product.findOne({ slug }) as any;
        if (!product) return next(new HttpError('Product Error', 'Product Not Found', 404));
        res.status(200).json({ message: 'Product found', product: product['_doc'] })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get single product'))
    }
};

export const searchStore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query;
        const categories = await Category.find({ name: { $regex: `(?i)${query}(?-i)` } });
        const products = await Product.find({ name: { $regex: `(?i)${query}(?-i)` } });
        res.status(200).json({ message: 'Results', categories, products })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to search the store'))
    }
}

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { products, firstName, lastName, email, phone } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) return next(new HttpError('Validation error', errors.array()[0].msg, 422));

        const orders = await Order.count();
        const orderNumber = orders + 1;

        const newOrder = new Order({
            number: orderNumber,
            customer: {
                firstName,
                lastName,
                email,
                phone
            },
            products
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to create order'))
    }
}

export const validatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { reference, orderId } = req.body;

        const foundOrder = await Order.findById(orderId);
        if (!foundOrder) return next(new HttpError('Order error', 'Order not found', 404));

        const requestConfig = {
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            }
        }
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, requestConfig);
        const responseStatus = response.data.data.status;
        if (responseStatus === 'success') {
            await Order.findOneAndUpdate({ _id: orderId }, { $set: { status: 'Paid', 'payment.paid': true, reference } }, { new: true })
        } else {
            return next(new HttpError('Verification failed', 'Payment Verification Failed. Please try again', 403));
        }

        const updatedOrder = await Order.findById(orderId)

        res.status(200).json({ message: 'Order payment completed', order: updatedOrder?.toObject() });
    } catch (err: any) {
        console.log(err?.response?.data || err || 'Something went wrong');
        return next(new HttpError('Unable to verify order payment'))
    }
}