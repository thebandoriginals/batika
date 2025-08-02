import { Router } from "express";
import { getCategories, getProducts, getSingleCategory, getSingleProduct, main, searchStore } from "../controllers/main";

const mainRouter = Router();

mainRouter.get('/', main);

mainRouter.get('/categories', getCategories);

mainRouter.get('/single-category', getSingleCategory);

mainRouter.get('/products', getProducts);

mainRouter.get('/single-product', getSingleProduct);

mainRouter.get('/search-store', searchStore);

export default mainRouter;