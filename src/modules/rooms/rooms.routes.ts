import express from 'express';
import { roomController } from './rooms.controller';
import auth from '../../middlewares/auth';
import loger from '../../middlewares/loger';
const router = express.Router();
router.post('/', auth('admin'), loger, roomController.createRoom);
export const roomRoutes = router;
