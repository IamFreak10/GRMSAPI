"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const config_1 = __importStar(require("../../config"));
const db_1 = __importDefault(require("../../config/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginUser = async (email, password) => {
    const result = await db_1.default.query(`SELECT * FROM users  WHERE email=$1`, [email]);
    //
    if (result.rows.length === 0) {
        return null;
    }
    const user = result.rows[0];
    const isValid = await config_1.bcrypT.compare(password, user.password);
    if (!isValid) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({
        name: user.name,
        email: user.email,
        role: user.role,
    }, config_1.default.jwtsecret, {
        expiresIn: '7d',
    });
    console.log(token, user);
    return { token, user };
};
exports.authService = {
    loginUser,
};
//# sourceMappingURL=auth.service.js.map