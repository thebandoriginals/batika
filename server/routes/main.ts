import { Router } from "express";
import { createOrder, getCategories, getProducts, getSingleCategory, getSingleProduct, main, searchStore, validatePayment } from "../controllers/main";
import { body } from "express-validator";

const mainRouter = Router();

mainRouter.get('/', main);

mainRouter.get('/categories', getCategories);

mainRouter.get('/single-category', getSingleCategory);

mainRouter.get('/products', getProducts);

mainRouter.get('/single-product', getSingleProduct);

mainRouter.get('/search-store', searchStore);

mainRouter.post('/create-order', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').notEmpty().withMessage('Email address is required'),
], createOrder);

mainRouter.post('/validate-payment', validatePayment)

export default mainRouter;