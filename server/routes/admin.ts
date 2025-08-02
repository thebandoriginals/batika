import { Router } from "express";
import accessToken from "../middleware/access-token";
import adminAccessToken from "../middleware/admin-access-token";
import { body } from "express-validator";
import { addCategory, addProduct, changeOrderStatus, deleteCategory, deleteProduct, editCategory, editProduct, getOrders, singleOrder } from "../controllers/admin";

const adminRouter = Router();

adminRouter.post('/add-category', accessToken, adminAccessToken, [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('slug').isLength({ min: 1 }).withMessage('Slug is required'),
], addCategory);

adminRouter.patch('/edit-category', accessToken, adminAccessToken, [
    body('_id').isLength({ min: 1 }).withMessage('Id of the category is required'),
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('slug').isLength({ min: 1 }).withMessage('Slug is required'),
], editCategory);

adminRouter.delete('/delete-category/:_id', accessToken, adminAccessToken, deleteCategory);

adminRouter.post('/add-product', accessToken, adminAccessToken, [
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('slug').isLength({ min: 1 }).withMessage('Slug is required'),
    body('price').isLength({ min: 1 }).isNumeric().withMessage('Price is required')
], addProduct);

adminRouter.patch('/edit-product', accessToken, adminAccessToken, [
    body('_id').isLength({ min: 1 }).withMessage('Id of the product is required'),
    body('name').isLength({ min: 1 }).withMessage('Name is required'),
    body('slug').isLength({ min: 1 }).withMessage('Slug is required'),
    body('price').isLength({ min: 1 }).isNumeric().withMessage('Price is required')
], editProduct);

adminRouter.delete('/delete-product/:_id', accessToken, adminAccessToken, deleteProduct);

adminRouter.get('/orders', accessToken, adminAccessToken, getOrders);

adminRouter.get('/order/:_id', accessToken, adminAccessToken, singleOrder);

adminRouter.patch('/change-order-status', accessToken, adminAccessToken, changeOrderStatus);

export default adminRouter;