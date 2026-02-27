import { Request, Response } from 'express';
import { roomService } from './rooms.service';

// Create a new room
const createRoom = async (req: Request, res: Response) => {
  try {
    const result = await roomService.createRoom(req.body);
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
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message || 'Internal Server Error',
    });
  }
};

// Get Room data by date and all status for both admin and user
const getRoomStatus = async (req: Request, res: Response) => {
  try {
    const result = await roomService.getRoomStatus(
      req.query.date,
      req.query.branch
    );

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
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message || 'Internal Server Error',
    });
  }
};
export const roomController = {
  createRoom,
  getRoomStatus,
};
