"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const userLogin = async (req, res) => {
    try {
        const result = await auth_service_1.authService.loginUser(req.body.email, req.body.password);
        if (!result) {
            return res.status(404).json({
                scuccess: false,
                message: 'User Not Found',
            });
        }
        res.status(201).json({
            success: true,
            message: 'Login successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(201).json({
            sucess: false,
            message: err.message,
        });
    }
};
exports.authController = {
    userLogin,
};
//# sourceMappingURL=auth.controllers.js.map