"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileDetails = exports.getProfileDetails = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../models/http-error"));
const check_unique_credentials_1 = require("../middleware/check-unique-credentials");
const user_1 = __importDefault(require("../models/user"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        const foundEmail = yield (0, check_unique_credentials_1.checkEmailExistence)(email === null || email === void 0 ? void 0 : email.trim());
        if (foundEmail)
            return next(new http_error_1.default('Email error', 'The email address already exists', 422));
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new user_1.default({ firstName: firstName === null || firstName === void 0 ? void 0 : firstName.trim(), lastName: lastName === null || lastName === void 0 ? void 0 : lastName.trim(), email: email === null || email === void 0 ? void 0 : email.trim(), password: hashedPassword });
        yield newUser.save();
        const accessToken = jsonwebtoken_1.default.sign({ _id: newUser === null || newUser === void 0 ? void 0 : newUser._id, firstName, email }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
        const registeredUser = yield user_1.default.findById(newUser === null || newUser === void 0 ? void 0 : newUser._id, { password: 0 });
        res.status(201).json({ message: 'User registered successfully', user: registeredUser['_doc'], accessToken });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to register user'));
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundUser = yield user_1.default.findOne({ email });
        if (!foundUser)
            return next(new http_error_1.default('Validation error', 'Invalid login credentials', 422));
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password);
        if (!isPasswordCorrect)
            return next(new http_error_1.default('Validation error', 'Invalid login credentials', 422));
        const accessToken = jsonwebtoken_1.default.sign({ _id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
        const profile = foundUser['_doc'];
        delete profile.password;
        res.status(200).json({ message: 'User logged in successfully', user: profile, accessToken });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to login agent'));
    }
});
exports.login = login;
const getProfileDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'User details provided', user: req.user });
    }
    catch (err) {
        return next(new http_error_1.default('Unable to get profile details'));
    }
});
exports.getProfileDetails = getProfileDetails;
const updateProfileDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, photoURL } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        yield user_1.default.updateOne({ _id: req.id }, { $set: { firstName: firstName === null || firstName === void 0 ? void 0 : firstName.trim(), lastName: lastName === null || lastName === void 0 ? void 0 : lastName.trim(), photoURL } });
        res.status(200).json({ message: 'Details updated' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to update profile details'));
    }
});
exports.updateProfileDetails = updateProfileDetails;
//# sourceMappingURL=auth.js.map