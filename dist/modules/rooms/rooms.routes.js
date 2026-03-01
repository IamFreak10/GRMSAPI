"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const rooms_controller_1 = require("./rooms.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const loger_1 = __importDefault(require("../../middlewares/loger"));
const router = express_1.default.Router();
router.get('/availability', (0, auth_1.default)('admin', 'user'), rooms_controller_1.roomController.getRoomStatus);
// Add a new room,admin only
router.post('/', (0, auth_1.default)('admin'), loger_1.default, rooms_controller_1.roomController.createRoom);
exports.roomRoutes = router;
//# sourceMappingURL=rooms.routes.js.map