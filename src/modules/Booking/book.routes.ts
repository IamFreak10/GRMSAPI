import express from 'express';
import { bookController } from './book.controller';

const router = express.Router();

router.post('/create-ssl-payment', bookController.bookNPayment);

export const bookRoutes = router;
