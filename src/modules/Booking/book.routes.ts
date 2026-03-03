import express from 'express';
import { bookController } from './book.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-ssl-payment', bookController.bookNPayment);
router.post('/payment/success', bookController.paymentSuccess);

// get successful Bookings
router.get('/my-bookings/:userId', auth('user'), bookController.getMyBookings);

// get pending Bookings
router.get('/pending', auth('admin'), bookController.getPendingBookings);

// এডমিন এই রাউটে হিট করে এলাউ করবে
router.patch('/allow-guest', auth('admin'), bookController.allowGuestCheckIn);
// এডমিন এই রাউটে পেন্ডিং পারমিট লিস্ট দেখবে
router.get('/pending-permits', auth('admin'), bookController.getPendingPermits);

// get all rooms status for admin only book.routes.ts
router.get('/all-rooms-status', auth('admin'), bookController.getAllRooms);

// !ADMIN ONLY
router.patch('/check-in', auth('admin'), bookController.handleCheckIn);
// !ADMIN ONLY
router.patch('/check-out', auth('admin'), bookController.handleCheckOut);
// !ADMIN ONLY
router.get('/all-bookings-for-admin', auth('admin'), bookController.getAllBookings);

export const bookRoutes = router;
