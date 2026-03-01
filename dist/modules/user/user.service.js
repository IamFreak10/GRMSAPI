"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const config_1 = require("../../config");
const db_1 = __importDefault(require("../../config/db"));
const createUser = async (payload) => {
    const { name, email, password, role = 'user', gender, age, phone, photo_url, } = payload;
    // Hash password
    const hashedPassword = await config_1.bcrypT.hash(password, 10);
    try {
        const result = await db_1.default.query(`INSERT INTO users 
      (name, email, password, role, gender, age, phone, photo_url) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
      RETURNING id, name, email, role, gender, age, phone, photo_url, created_at`, [name, email, hashedPassword, role, gender, age, phone, photo_url]);
        // Return single row directly
        return result.rows[0];
    }
    catch (error) {
        console.error('Error in createUser:', error);
        throw error;
    }
};
exports.userService = {
    createUser,
};
//# sourceMappingURL=user.service.js.map