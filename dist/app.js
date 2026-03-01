"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = require("./modules/user/user.routes");
const upload_routes_1 = require("./modules/upload/upload.routes");
const auth_routes_1 = require("./modules/auth/auth.routes");
const rooms_routes_1 = require("./modules/rooms/rooms.routes");
const book_routes_1 = require("./modules/Booking/book.routes");
exports.app = (0, express_1.default)();
// parser
exports.app.use(express_1.default.json());
// app.use(express.json()) এর ঠিক নিচে এটি যোগ করুন
exports.app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log('Body:', req.body); // এখানে দেখতে পারবেন ডাটা আসছে কি না
    next();
});
exports.app.use((0, cors_1.default)({
    origin: true, // এটি সাময়িকভাবে সব অরিজিন এলাউ করবে
    credentials: true,
}));
// User routes
exports.app.use('/users', user_routes_1.userRoutes);
// Upload API
exports.app.use('/upload', upload_routes_1.uploadRoute);
// authroutes
exports.app.use('/auth', auth_routes_1.authRoutes);
// rooms
exports.app.use('/rooms', rooms_routes_1.roomRoutes);
//booking
exports.app.use('/booking', book_routes_1.bookRoutes);
exports.app.get('/', (req, res) => {
    res.send('GRMS API Root');
});
exports.default = exports.app;
//# sourceMappingURL=app.js.map