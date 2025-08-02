import { Router } from "express";
import accessToken from "../middleware/access-token";
import { createOrder, manageCart, myOrders, singleOrder, stripePayment } from "../controllers/user";

const userRouter = Router();

userRouter.patch('/manage-cart', accessToken, manageCart);

userRouter.get('/create-order', accessToken, createOrder);

userRouter.get('/orders', accessToken, myOrders)

userRouter.get('/order/:_id', accessToken, singleOrder);

userRouter.post('/pay', accessToken, stripePayment);

export default userRouter;