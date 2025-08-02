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
exports.changeOrderStatus = exports.singleOrder = exports.getOrders = exports.deleteProduct = exports.editProduct = exports.addProduct = exports.deleteCategory = exports.editCategory = exports.addCategory = void 0;
const http_error_1 = __importDefault(require("../models/http-error"));
const express_validator_1 = require("express-validator");
const check_unique_credentials_1 = require("../middleware/check-unique-credentials");
const category_1 = __importDefault(require("../models/category"));
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, parent, image } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        const isSlugExisting = yield (0, check_unique_credentials_1.checkCategorySlugExistence)(slug === null || slug === void 0 ? void 0 : slug.trim());
        if (isSlugExisting)
            return next(new http_error_1.default('Category error', 'The slug already exists', 422));
        const newCategory = new category_1.default({ name: name === null || name === void 0 ? void 0 : name.trim(), slug: slug === null || slug === void 0 ? void 0 : slug.trim(), parent, image });
        yield newCategory.save();
        res.status(200).json({ message: 'Category created', category: newCategory['_doc'] });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to add category'));
    }
});
exports.addCategory = addCategory;
const editCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, name, slug, parent, image } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        const foundCategory = yield category_1.default.findById(_id);
        if (!foundCategory)
            return next(new http_error_1.default('Category error', 'Category Not Found', 404));
        const isSlugExisting = yield (0, check_unique_credentials_1.checkCategorySlugExistence)(slug === null || slug === void 0 ? void 0 : slug.trim(), _id);
        if (isSlugExisting)
            return next(new http_error_1.default('Category error', 'The slug already exists', 422));
        yield category_1.default.updateOne({ _id }, { $set: { name: name === null || name === void 0 ? void 0 : name.trim(), slug: slug === null || slug === void 0 ? void 0 : slug.trim(), parent, image } });
        res.status(200).json({ message: 'Category updated successfully' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to edit category'));
    }
});
exports.editCategory = editCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const foundCategory = yield category_1.default.findById(_id);
        if (!foundCategory)
            return next(new http_error_1.default('Category error', 'Category Not Found', 404));
        yield category_1.default.deleteOne({ _id });
        res.status(200).json({ message: 'Category removed' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to delete category'));
    }
});
exports.deleteCategory = deleteCategory;
const addProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slug, price, images, sizes, colors, categories } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        const productSlugExisting = yield (0, check_unique_credentials_1.checkProductSlugExistence)(slug === null || slug === void 0 ? void 0 : slug.trim());
        if (productSlugExisting)
            return next(new http_error_1.default('Product error', 'The product slug already exists', 422));
        const newProduct = new product_1.default({ name: name === null || name === void 0 ? void 0 : name.trim(), slug: slug === null || slug === void 0 ? void 0 : slug.trim(), price, images, sizes, colors, categories });
        yield newProduct.save();
        res.status(200).json({ message: 'product created', product: newProduct['_doc'] });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to add product'));
    }
});
exports.addProduct = addProduct;
const editProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, name, slug, price, images, sizes, colors, categories } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        const foundProduct = yield product_1.default.findById(_id);
        if (!foundProduct)
            return next(new http_error_1.default('Product Error', 'Product Not Found', 404));
        const productSlugExisting = yield (0, check_unique_credentials_1.checkProductSlugExistence)(slug === null || slug === void 0 ? void 0 : slug.trim(), _id);
        if (productSlugExisting)
            return next(new http_error_1.default('Product error', 'The product slug already exists', 422));
        yield product_1.default.updateOne({ _id }, { $set: { name: name === null || name === void 0 ? void 0 : name.trim(), slug: slug === null || slug === void 0 ? void 0 : slug.trim(), price, images, sizes, colors, categories } });
        res.status(200).json({ message: "Product updated" });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to edit product'));
    }
});
exports.editProduct = editProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.params;
        const foundProduct = yield product_1.default.findById(_id);
        if (!foundProduct)
            return next(new http_error_1.default('Product error', 'Product not found', 404));
        yield product_1.default.deleteOne({ _id });
        res.status(200).json({ message: "Product deleted" });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to delete product'));
    }
});
exports.deleteProduct = deleteProduct;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ message: 'Orders', orders });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get orders'));
    }
});
exports.getOrders = getOrders;
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
const changeOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, orderId } = req.body;
        const foundOrder = yield order_1.default.findById(orderId);
        if (!foundOrder)
            return next(new http_error_1.default('Order Error', 'Order Not Found', 404));
        yield order_1.default.updateOne({ _id: orderId }, { $set: { status } });
        res.status(200).json({ message: 'Order status changed' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to change status'));
    }
});
exports.changeOrderStatus = changeOrderStatus;
//# sourceMappingURL=admin.js.map