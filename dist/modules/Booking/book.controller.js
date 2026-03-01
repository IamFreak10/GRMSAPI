"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookController = void 0;
const book_service_1 = require("./book.service");
const bookNPayment = async (req, res) => {
    try {
        const paymentData = req.body;
        const result = await book_service_1.bookingServices.initiatePayment(paymentData);
        console.log('SSLCommerz Response:', result);
        if (result?.status === 'SUCCESS') {
            return res.status(200).json({
                success: true,
                paymentUrl: result.GatewayPageURL,
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: result?.failedreason || 'Initiation failed',
            });
        }
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message || 'Internal Server Error',
        });
    }
};
exports.bookController = {
    bookNPayment,
};
//# sourceMappingURL=book.controller.js.map