"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripePayment = exports.singleOrder = exports.myOrders = exports.createOrder = exports.manageCart = void 0;
const http_error_1 = __importDefault(require("../models/http-error"));
const user_1 = __importDefault(require("../models/user"));
const order_1 = __importDefault(require("../models/order"));
const stripe_1 = require("stripe");
const transaction_1 = __importDefault(require("../models/transaction"));
const manageCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cart } = req.body;
        yield user_1.default.updateOne({ _id: req.id }, { $set: { cart } });
        res.status(200).json({ message: 'Cart managed' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to manage cart'));
    }
});
exports.manageCart = manageCart;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = req.user;
        if (!(user === null || user === void 0 ? void 0 : user.cart) || ((_a = user === null || user === void 0 ? void 0 : user.cart) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return next(new http_error_1.default('Error', 'You have not yet added anything to your cart', 422));
        const orders = yield order_1.default.find().count();
        const createdOrder = {
            number: orders + 1,
            customer: {
                _id: user === null || user === void 0 ? void 0 : user._id,
                firstName: user === null || user === void 0 ? void 0 : user.firstName,
                lastName: user === null || user === void 0 ? void 0 : user.lastName,
                email: user === null || user === void 0 ? void 0 : user.email,
            },
            products: user === null || user === void 0 ? void 0 : user.cart,
            payment: {
                paid: false,
                amount: (_b = user === null || user === void 0 ? void 0 : user.cart) === null || _b === void 0 ? void 0 : _b.reduce((acc, item) => acc + ((item === null || item === void 0 ? void 0 : item.price) * (item === null || item === void 0 ? void 0 : item.quantity)), 0)
            }
        };
        const newOrder = new order_1.default(createdOrder);
        yield newOrder.save();
        yield user_1.default.updateOne({ _id: req.id }, { $set: { cart: [] } });
        res.status(200).json({ message: 'Order Created', order: newOrder['_doc'] });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to create order'));
    }
});
exports.createOrder = createOrder;
const myOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find({ 'customer._id': req.id }).sort({ createdAt: 1 });
        res.status(200).json({ message: 'Orders Found', orders });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get user orders'));
    }
});
exports.myOrders = myOrders;
const singleOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_1.default.findById(req.params._id);
        if (!order)
            return next(new http_error_1.default('Order Error', 'Order Not Found', 404));
        res.status(200).json({ message: 'Order Found', order: order['_doc'] });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get single order'));
    }
});
exports.singleOrder = singleOrder;
const stripePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const StripeInstance = new stripe_1.Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2023-08-16' });
        const { token, orderId } = req.body;
        const foundOrder = yield order_1.default.findById(orderId);
        if (!foundOrder)
            return next(new http_error_1.default('Order Error', 'Order Not Found', 404));
        const amountInCents = Math.round(((_c = foundOrder.payment) === null || _c === void 0 ? void 0 : _c.amount) * 100);
        yield StripeInstance.charges.create({
            source: token === null || token === void 0 ? void 0 : token.id,
            amount: amountInCents,
            currency: 'usd'
        });
        const newTransaction = new transaction_1.default({ amount: (_d = foundOrder.payment) === null || _d === void 0 ? void 0 : _d.amount, order: orderId, reference: token === null || token === void 0 ? void 0 : token.id });
        yield newTransaction.save();
        yield order_1.default.updateOne({ _id: orderId }, { $set: { status: 'Paid', 'payment.paid': true, 'payment.reference': token === null || token === void 0 ? void 0 : token.id } });
        res.status(200).json({ message: 'Order payment has been successfull' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to pay using stripe'));
    }
});
exports.stripePayment = stripePayment;
//# sourceMappingURL=user.js.map