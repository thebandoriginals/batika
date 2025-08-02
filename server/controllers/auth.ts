import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

import HttpError from "../models/http-error";
import { checkEmailExistence } from "../middleware/check-unique-credentials";
import User from "../models/user";
import { TokenRequest } from "../utils/types";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422));
        };
        const foundEmail = await checkEmailExistence(email?.trim());
        if (foundEmail) return next(new HttpError('Email error', 'The email address already exists', 422));
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ firstName: firstName?.trim(), lastName: lastName?.trim(), email: email?.trim(), password: hashedPassword });
        await newUser.save();
        const accessToken = jwt.sign({ _id: newUser?._id, firstName, email }, process.env.TOKEN_SECRET as Secret, { expiresIn: 60 * 60 * 24 });
        const registeredUser = await User.findById(newUser?._id, { password: 0 }) as any;
        res.status(201).json({ message: 'User registered successfully', user: registeredUser['_doc'], accessToken });
    } catch (err) {
        console.log(err)
        return next(new HttpError('Unable to register user'))
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email }) as any;
        if (!foundUser) return next(new HttpError('Validation error', 'Invalid login credentials', 422));
        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password);
        if (!isPasswordCorrect) return next(new HttpError('Validation error', 'Invalid login credentials', 422));
        const accessToken = jwt.sign({ _id: foundUser?._id }, process.env.TOKEN_SECRET as Secret, { expiresIn: 60 * 60 * 24 });
        const profile = foundUser['_doc']
        delete profile.password;
        res.status(200).json({ message: 'User logged in successfully', user: profile, accessToken });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to login agent'));
    }
}

export const getProfileDetails = async(req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: 'User details provided', user: req.user });
    } catch (err) {
        return next(new HttpError('Unable to get profile details'));
    }
}

export const updateProfileDetails = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, photoURL } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422));
        };
        await User.updateOne({ _id: req.id }, { $set: { firstName: firstName?.trim(), lastName: lastName?.trim(), photoURL } });
        res.status(200).json({ message: 'Details updated' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to update profile details'))
    }
}