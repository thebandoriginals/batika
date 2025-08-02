"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_1 = require("../controllers/main");
const mainRouter = (0, express_1.Router)();
mainRouter.get('/', main_1.main);
mainRouter.get('/categories', main_1.getCategories);
mainRouter.get('/single-category', main_1.getSingleCategory);
mainRouter.get('/products', main_1.getProducts);
mainRouter.get('/single-product', main_1.getSingleProduct);
mainRouter.get('/search-store', main_1.searchStore);
exports.default = mainRouter;
//# sourceMappingURL=main.js.map