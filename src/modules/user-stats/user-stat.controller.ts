import { Request, Response } from 'express';
import { userStatService } from './user-stat.service';

const getMyStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; 

    const stats = await userStatService.getUserAnalytics(userId);

    res.status(200).json({
      success: true,
      message: "User statistics fetched successfully",
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};

export const userStatController = {
  getMyStats
};