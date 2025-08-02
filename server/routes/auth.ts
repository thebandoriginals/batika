import { Router } from "express";
import { getProfileDetails, login, register, updateProfileDetails } from "../controllers/auth";
import { body } from "express-validator";
import accessToken from "../middleware/access-token";

const authRouter = Router();

authRouter.post('/register', [
    body('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isLength({ min: 1 }).isEmail().withMessage('Email is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required'),
], register);

authRouter.post('/login', login);

authRouter.get('/profile', accessToken, getProfileDetails);

authRouter.patch('/update-profile', accessToken, [
    body('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
], updateProfileDetails);

export default authRouter;