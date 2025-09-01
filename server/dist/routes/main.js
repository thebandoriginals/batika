"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_1 = require("../controllers/main");
const express_validator_1 = require("express-validator");
const mainRouter = (0, express_1.Router)();
mainRouter.get('/', main_1.main);
mainRouter.get('/categories', main_1.getCategories);
mainRouter.get('/single-category', main_1.getSingleCategory);
mainRouter.get('/products', main_1.getProducts);
mainRouter.get('/single-product', main_1.getSingleProduct);
mainRouter.get('/search-store', main_1.searchStore);
mainRouter.post('/create-order', [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').notEmpty().withMessage('Email address is required'),
], main_1.createOrder);
mainRouter.post('/validate-payment', main_1.validatePayment);
exports.default = mainRouter;
//# sourceMappingURL=main.js.map