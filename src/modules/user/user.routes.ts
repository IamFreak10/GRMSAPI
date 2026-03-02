import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import app from '../../app';
const router = express.Router();

router.post('/', userController.userPost);
router.get('/me', auth('user', 'admin'), userController.getMe);
router.patch('/update-me', auth('user', 'admin'), userController.updateMe);
export const userRoutes = router;
