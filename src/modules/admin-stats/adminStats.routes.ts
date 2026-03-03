
import express from 'express';
import { adminStatsController } from './adminStats.controller';
import auth from '../../middlewares/auth'; 
const router = express.Router();

router.get('/', auth('admin'), adminStatsController.getStats);

export const adminStatsRoutes = router;
