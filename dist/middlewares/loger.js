"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} \n`);
    next();
};
exports.default = loger;
//# sourceMappingURL=loger.js.map