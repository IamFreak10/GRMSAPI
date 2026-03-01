import express from 'express';
import { bookController } from './book.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-ssl-payment', auth('user'), bookController.bookNPayment);
router.post('/payment/success', bookController.paymentSuccess);

// get successful Bookings
router.get('/my-bookings/:userId', auth('user'), bookController.getMyBookings);

export const bookRoutes = router;
