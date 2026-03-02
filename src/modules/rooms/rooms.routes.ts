import express from 'express';
import { roomController } from './rooms.controller';
import auth from '../../middlewares/auth';
import loger from '../../middlewares/loger';
const router = express.Router();
// Get Room data by date and all status for both admin and user
router.get(
  '/availability',
  auth('admin', 'user'),
  roomController.getRoomStatus
);

// Get Room data by date and all status for both admin and user
router.get('/all-rooms', auth('admin'), roomController.getRoomInventory);

// Add a new room,admin only
router.post('/', auth('admin'), loger, roomController.createRoom);
export const roomRoutes = router;
