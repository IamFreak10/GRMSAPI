"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization;
            console.log('token:', token);
            if (!token) {
                return res.status(500).json({
                    message: 'You are not authenticated',
                });
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwtsecret);
            req.user = decodedToken;
            console.log(req.user);
            if (!roles.includes(decodedToken.role)) {
                return res.status(403).json({
                    sucess: false,
                    message: 'You Do not Have Permission',
                });
            }
            next();
        }
        catch (e) {
            return res.status(401).json({
                sucess: false,
                message: e.message || 'Invalid or Expired Token',
            });
        }
    };
};
exports.default = auth;
//# sourceMappingURL=auth.js.map