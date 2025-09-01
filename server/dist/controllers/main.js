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
exports.validatePayment = exports.createOrder = exports.searchStore = exports.getSingleProduct = exports.getProducts = exports.getSingleCategory = exports.getCategories = exports.main = void 0;
const http_error_1 = __importDefault(require("../models/http-error"));
const category_1 = __importDefault(require("../models/category"));
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const src_1 = require("express-validator/src");
const axios_1 = __importDefault(require("axios"));
const main = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Batika' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to load server'));
    }
});
exports.main = main;
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Categories found', categories });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get categories'));
    }
});
exports.getCategories = getCategories;
const getSingleCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.query;
        const foundCategory = yield category_1.default.findOne({ slug });
        if (!foundCategory)
            return next(new http_error_1.default('Category error', 'Category not found', 404));
        const foundProducts = yield product_1.default.find({ categories: foundCategory === null || foundCategory === void 0 ? void 0 : foundCategory.name }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Category found', category: foundCategory['_doc'], products: foundProducts });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get single category'));
    }
});
exports.getSingleCategory = getSingleCategory;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Products found', products });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get products'));
    }
});
exports.getProducts = getProducts;
const getSingleProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.query;
        const product = yield product_1.default.findOne({ slug });
        if (!product)
            return next(new http_error_1.default('Product Error', 'Product Not Found', 404));
        res.status(200).json({ message: 'Product found', product: product['_doc'] });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get single product'));
    }
});
exports.getSingleProduct = getSingleProduct;
const searchStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        const categories = yield category_1.default.find({ name: { $regex: `(?i)${query}(?-i)` } });
        const products = yield product_1.default.find({ name: { $regex: `(?i)${query}(?-i)` } });
        res.status(200).json({ message: 'Results', categories, products });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to search the store'));
    }
});
exports.searchStore = searchStore;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products, firstName, lastName, email, phone } = req.body;
        const errors = (0, src_1.validationResult)(req);
        if (!errors.isEmpty())
            return next(new http_error_1.default('Validation error', errors.array()[0].msg, 422));
        const orders = yield order_1.default.count();
        const orderNumber = orders + 1;
        const newOrder = new order_1.default({
            number: orderNumber,
            customer: {
                firstName,
                lastName,
                email,
                phone
            },
            products
        });
        yield newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to create order'));
    }
});
exports.createOrder = createOrder;
const validatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { reference, orderId } = req.body;
        const foundOrder = yield order_1.default.findById(orderId);
        if (!foundOrder)
            return next(new http_error_1.default('Order error', 'Order not found', 404));
        const requestConfig = {
            headers: {
                'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            }
        };
        const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, requestConfig);
        const responseStatus = response.data.data.status;
        if (responseStatus === 'success') {
            yield order_1.default.findOneAndUpdate({ _id: orderId }, { $set: { status: 'Paid', 'payment.paid': true, reference } }, { new: true });
        }
        else {
            return next(new http_error_1.default('Verification failed', 'Payment Verification Failed. Please try again', 403));
        }
        const updatedOrder = yield order_1.default.findById(orderId);
        res.status(200).json({ message: 'Order payment completed', order: updatedOrder === null || updatedOrder === void 0 ? void 0 : updatedOrder.toObject() });
    }
    catch (err) {
        console.log(((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) || err || 'Something went wrong');
        return next(new http_error_1.default('Unable to verify order payment'));
    }
});
exports.validatePayment = validatePayment;
//# sourceMappingURL=main.js.map