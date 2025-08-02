import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import HttpError from '../models/http-error';
import User from '../models/user';
import { TokenRequest } from '../utils/types';


export default async function accessToken (req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if(!token) return next(new HttpError('Access token error', 'Invalid or expired access token', 403));
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as Secret) as any;
        const id = decodedToken?._id.trim();
        const foundUser = await User.findById(id, { password: 0 }) as any;
        if (!foundUser) return next(new HttpError('Access token error', 'Invalid or expired access token', 403));
        req.id = id;
        req.user = foundUser['_doc'];
        req.isAdmin = foundUser?.role === 'admin';
        next();
    } catch (err) {
        return next(new HttpError('Access token validation failed'))
    }
}