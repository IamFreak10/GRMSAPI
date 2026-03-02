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

const getRoomInventory = async (req: Request, res: Response) => {
  try {
    const { branch } = req.query;

    if (!branch) {
      return res
        .status(400)
        .json({ success: false, message: 'Branch is required' });
    }

    // ১. সার্ভিস থেকে ডাটা নিয়ে আসা
    const rawData = await roomService.getRoomsAndBedsStatus(branch as string);

    /**
     *
     *  [{room_no: 'D-201', bed_id: 'A', occupied: true...}, ...]
     *  [{roomNo: 'D-201', beds: [{id: 'A', occupied: true...}], ...}]
     */
    const formattedData = rawData.reduce((acc: any[], row: any) => {
      let room = acc.find((r) => r.roomNo === row.room_no);

      if (!room) {
        room = {
          roomNo: row.room_no,
          type: row.type,
          gender: row.gender || 'neutral',
          beds: [],
        };
        acc.push(room);
      }

      if (row.gender && room.gender === 'neutral') {
        room.gender = row.gender;
      }

      room.beds.push({
        id: row.bed_label,
        occupied: row.is_occupied ? true : false,
        guest: row.guest_name || null,
      });

      return acc;
    }, []);

    res.status(200).json({
      success: true,
      message: 'Room structure fetched successfully',
      data: formattedData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};
export const roomController = {
  createRoom,
  getRoomStatus,
  getRoomInventory,
};
