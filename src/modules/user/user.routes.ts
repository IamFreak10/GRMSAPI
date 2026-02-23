import express from 'express';
import { userController } from './user.controller';
const router = express.Router();

router.post('/',userController.userPost);
export const userRoutes = router;