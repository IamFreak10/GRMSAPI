"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const userPost = async (req, res) => {
    try {
        const user = await user_service_1.userService.createUser(req.body);
        console.log('User in Create post', user);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    }
    catch (e) {
        // console.error('Error in userPost:', e);
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};
exports.userController = {
    userPost,
};
//# sourceMappingURL=user.controller.js.map