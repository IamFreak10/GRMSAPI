"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoute = void 0;
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("./upload.controller");
const router = express_1.default.Router();
// Maximum 10 images at a time
router.post('/', upload_controller_1.parser.array('images', 10), upload_controller_1.uploadImages);
exports.uploadRoute = router;
//# sourceMappingURL=upload.routes.js.map