"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomController = void 0;
const rooms_service_1 = require("./rooms.service");
// Create a new room
const createRoom = async (req, res) => {
    try {
        const result = await rooms_service_1.roomService.createRoom(req.body);
        console.log(result);
        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'Could not create room',
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Room and beds created successfully',
            data: result,
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message || 'Internal Server Error',
        });
    }
};
// Get Room data by date and all status for both admin and user
const getRoomStatus = async (req, res) => {
    try {
        const result = await rooms_service_1.roomService.getRoomStatus(req.query.date, req.query.branch);
        if (!result) {
            return res.status(400).json({
                success: false,
                message: 'Could not get Room Status',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Room status fetched successfully',
            data: result,
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message || 'Internal Server Error',
        });
    }
};
exports.roomController = {
    createRoom,
    getRoomStatus,
};
//# sourceMappingURL=rooms.controller.js.map