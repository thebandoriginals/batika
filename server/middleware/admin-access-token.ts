import { NextFunction, Response } from "express";
import { TokenRequest } from "../utils/types";
import HttpError from "../models/http-error";

export default async function adminAccessToken (req: TokenRequest, res: Response, next: NextFunction) {
    try {
        if (!req.isAdmin) return next(new HttpError('Access error', 'You are forbidden to access these resources', 403));
        next();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to validate admin access token'));
    }
}