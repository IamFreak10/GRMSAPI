import express from 'express';
import { bookController } from './book.controller';

const router = express.Router();

router.post('/create-ssl-payment', bookController.bookNPayment);
router.post('/payment/success', bookController.paymentSuccess);

export const bookRoutes = router;
