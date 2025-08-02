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
exports.checkProductSlugExistence = exports.checkCategorySlugExistence = exports.checkEmailExistence = void 0;
const category_1 = __importDefault(require("../models/category"));
const product_1 = __importDefault(require("../models/product"));
const user_1 = __importDefault(require("../models/user"));
const checkEmailExistence = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let foundUserWithEmail;
        if (!id)
            foundUserWithEmail = yield user_1.default.findOne({ email });
        else if (id)
            foundUserWithEmail = yield user_1.default.findOne({ $and: [{ _id: { $ne: id } }, { email }] });
        return (foundUserWithEmail);
    }
    catch (err) {
        console.log(err);
    }
});
exports.checkEmailExistence = checkEmailExistence;
const checkCategorySlugExistence = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    let foundSlug;
    if (!id)
        foundSlug = yield category_1.default.findOne({ slug });
    else if (id)
        foundSlug = yield category_1.default.findOne({ $and: [{ _id: { $ne: id } }, { slug }] });
    return !!foundSlug;
});
exports.checkCategorySlugExistence = checkCategorySlugExistence;
const checkProductSlugExistence = (slug, id) => __awaiter(void 0, void 0, void 0, function* () {
    let foundSlug;
    if (!id)
        foundSlug = yield product_1.default.findOne({ slug });
    else if (id)
        foundSlug = yield product_1.default.findOne({ $and: [{ _id: { $ne: id } }, { slug }] });
    return !!foundSlug;
});
exports.checkProductSlugExistence = checkProductSlugExistence;
//# sourceMappingURL=check-unique-credentials.js.map