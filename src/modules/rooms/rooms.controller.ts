import { Request, Response } from 'express';
import { roomService } from './rooms.service';

const createRoom = async (req: Request, res: Response) => {
  try {
    const result = await roomService.createRoom(req.body);
    console.log(result)
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

export const roomController = {
  createRoom,
};