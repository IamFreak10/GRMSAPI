"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcrypT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
exports.bcrypT = bcryptjs_1.default;
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const config = {
    port: process.env.PORT,
    connection_string: process.env.CONNECTION_STR,
    jwtsecret: process.env.JWT_SECRET,
};
exports.default = config;
//# sourceMappingURL=index.js.map