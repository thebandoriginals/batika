"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    constructor(message, content, code) {
        super(message);
        this.content = content;
        this.code = code;
    }
}
exports.default = HttpError;
//# sourceMappingURL=http-error.js.map