"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const access_token_1 = __importDefault(require("../middleware/access-token"));
const user_1 = require("../controllers/user");
const userRouter = (0, express_1.Router)();
userRouter.patch('/manage-cart', access_token_1.default, user_1.manageCart);
userRouter.get('/create-order', access_token_1.default, user_1.createOrder);
userRouter.get('/orders', access_token_1.default, user_1.myOrders);
userRouter.get('/order/:_id', access_token_1.default, user_1.singleOrder);
userRouter.post('/pay', access_token_1.default, user_1.stripePayment);
exports.default = userRouter;
//# sourceMappingURL=user.js.map