import { NextFunction, Response } from "express";
import HttpError from "../models/http-error";
import { TokenRequest } from "../utils/types";
import User from "../models/user";
import Order from "../models/order";
import { Stripe } from 'stripe';
import Transaction from "../models/transaction";

export const manageCart = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { cart } = req.body;
        await User.updateOne({ _id: req.id }, { $set: { cart } });
        res.status(200).json({ message: 'Cart managed' })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to manage cart'))
    }
}

export const createOrder = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user?.cart || user?.cart?.length === 0) return next(new HttpError('Error', 'You have not yet added anything to your cart', 422));
        const orders = await Order.find().count();
        const createdOrder = {
            number: orders + 1,
            customer: {
                _id: user?._id,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
            },
            products: user?.cart,
            payment: {
                paid: false,
                amount: user?.cart?.reduce((acc: number, item: any) => acc + (item?.price * item?.quantity), 0)
            }
        };
        const newOrder = new Order(createdOrder) as any;
        await newOrder.save();
        await User.updateOne({ _id: req.id }, { $set: { cart: [] } });
        res.status(200).json({ message: 'Order Created', order: newOrder['_doc'] })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to create order'))
    }
}

export const myOrders = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({ 'customer._id': req.id }).sort({ createdAt: 1 });
        res.status(200).json({ message: 'Orders Found', orders });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get user orders'))
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

export const stripePayment = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const StripeInstance = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2023-08-16' })
        const { token, orderId } = req.body;
        const foundOrder = await Order.findById(orderId);
        if (!foundOrder) return next(new HttpError('Order Error', 'Order Not Found', 404));
        const amountInCents = Math.round(foundOrder.payment?.amount! * 100);
        await StripeInstance.charges.create({
            source: token?.id,
            amount: amountInCents,
            currency: 'usd'
        });
        const newTransaction = new Transaction({ amount: foundOrder.payment?.amount!, order: orderId, reference: token?.id });
        await newTransaction.save();
        await Order.updateOne({ _id: orderId }, { $set: { status: 'Paid', 'payment.paid': true, 'payment.reference': token?.id } });
        res.status(200).json({ message: 'Order payment has been successfull' })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to pay using stripe'));
    }
}