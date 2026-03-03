
import { Request, Response } from 'express';
import { adminStatsService } from './adminStats.service';

const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await adminStatsService.getAdminStats();
    res.status(200).json({
      success: true,
      message: "মামা, সব ডাটা গরম গরম নিয়ে আসলাম!",
      data: stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Stats আনতে ঝামেলা হইছে!"
    });
  }
};

export const adminStatsController = { getStats };