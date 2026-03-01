"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
const port = config_1.default.port;
// async function testDB() {
//   try {
//     const client = await db.connect();
//     console.log('✅ Database connected successfully');
//     client.release();
//   } catch (error) {
//     console.error('❌ Database connection failed:', error);
//   }
// }
// testDB();
app_1.default.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map