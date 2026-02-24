import express from 'express';
import { authController } from './auth.controllers';

const router = express.Router();

router.post('/login', authController.userLogin);
export const authRoutes = router;
