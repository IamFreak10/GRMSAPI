import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import app from '../../app';
const router = express.Router();

router.post('/', userController.userPost);
export const userRoutes = router;
