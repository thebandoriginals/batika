"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const access_token_1 = __importDefault(require("../middleware/access-token"));
const admin_access_token_1 = __importDefault(require("../middleware/admin-access-token"));
const express_validator_1 = require("express-validator");
const admin_1 = require("../controllers/admin");
const adminRouter = (0, express_1.Router)();
adminRouter.post('/add-category', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('name').isLength({ min: 1 }).withMessage('Name is required'),
    (0, express_validator_1.body)('slug').isLength({ min: 1 }).withMessage('Slug is required'),
], admin_1.addCategory);
adminRouter.patch('/edit-category', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('_id').isLength({ min: 1 }).withMessage('Id of the category is required'),
    (0, express_validator_1.body)('name').isLength({ min: 1 }).withMessage('Name is required'),
    (0, express_validator_1.body)('slug').isLength({ min: 1 }).withMessage('Slug is required'),
], admin_1.editCategory);
adminRouter.delete('/delete-category/:_id', access_token_1.default, admin_access_token_1.default, admin_1.deleteCategory);
adminRouter.post('/add-product', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('name').isLength({ min: 1 }).withMessage('Name is required'),
    (0, express_validator_1.body)('slug').isLength({ min: 1 }).withMessage('Slug is required'),
    (0, express_validator_1.body)('price').isLength({ min: 1 }).isNumeric().withMessage('Price is required')
], admin_1.addProduct);
adminRouter.patch('/edit-product', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('_id').isLength({ min: 1 }).withMessage('Id of the product is required'),
    (0, express_validator_1.body)('name').isLength({ min: 1 }).withMessage('Name is required'),
    (0, express_validator_1.body)('slug').isLength({ min: 1 }).withMessage('Slug is required'),
    (0, express_validator_1.body)('price').isLength({ min: 1 }).isNumeric().withMessage('Price is required')
], admin_1.editProduct);
adminRouter.delete('/delete-product/:_id', access_token_1.default, admin_access_token_1.default, admin_1.deleteProduct);
adminRouter.get('/orders', access_token_1.default, admin_access_token_1.default, admin_1.getOrders);
adminRouter.get('/order/:_id', access_token_1.default, admin_access_token_1.default, admin_1.singleOrder);
adminRouter.patch('/change-order-status', access_token_1.default, admin_access_token_1.default, admin_1.changeOrderStatus);
exports.default = adminRouter;
//# sourceMappingURL=admin.js.map