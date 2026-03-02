import express from 'express';
import { emailController } from './email.controller';

const router = express.Router();


router.post('/', emailController.triggerSuccessEmail);

export const mailRoutes = router;
