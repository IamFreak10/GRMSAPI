"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const _1 = __importDefault(require("."));
exports.db = new pg_1.Pool({
    connectionString: `${_1.default.connection_string}`,
});
exports.default = exports.db;
//# sourceMappingURL=db.js.map