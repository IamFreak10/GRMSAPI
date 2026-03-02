import express from 'express';
import { userStatController } from './user-stat.controller';
import auth from '../../middlewares/auth'; 

const router = express.Router();


router.get('/my-stats', auth('user'), userStatController.getMyStats);

export const userStatRoutes = router;