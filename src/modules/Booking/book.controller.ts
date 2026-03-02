import { Request, Response } from 'express';
import { bookingServices } from './book.service';
import config from '../../config';

const bookNPayment = async (req: Request, res: Response) => {
  try {
    const paymentData = req.body;
    const trnxId = `trn_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const saveData = await bookingServices.createBooking(paymentData, trnxId);
    const result = await bookingServices.initiatePayment(paymentData, trnxId);

    if (result?.status === 'SUCCESS') {
      return res.status(200).json({
        success: true,
        paymentUrl: result.GatewayPageURL,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result?.failedreason || 'Initiation failed',
      });
    }
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message || 'Internal Server Error',
    });
  }
};
const paymentSuccess = async (req: Request, res: Response) => {
  const { txn } = req.query;

  try {
    await bookingServices.completeBookingProcess(txn as string);
    // সাকসেস হলে ফ্রন্টেন্ড ড্যাশবোর্ডে পাঠান
    res.redirect(`${config.frontend_url}/dashboard/book-room?status=success`);
  } catch (error) {
    console.error('Payment Error:', error);
    res.redirect(`${config.frontend_url}/payment-failed`);
  }
};

const getMyBookings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await bookingServices.getMyBookings(userId as string);
    return res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message || 'Internal Server Error',
    });
  }
};

const getPendingBookings = async (req: Request, res: Response) => {
  try {
    const { branch } = req.query;

    if (!branch) {
      return res
        .status(400)
        .json({ success: false, message: 'Branch is required' });
    }

    const result = await bookingServices.getPendingBookings(branch as string);

    res.status(200).json({
      success: true,
      message: 'Pending bookings fetched',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const allowGuestCheckIn = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const result = await bookingServices.permitGuest(bookingId);

    res.status(200).json({
      success: true,
      message: 'Guest permitted successfully!',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPendingPermits = async (req: Request, res: Response) => {
  try {
    const { branch } = req.query;
    const result = await bookingServices.getPendingPermits(branch as string);

    res.status(200).json({
      success: true,
      message: 'Pending permits fetched successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const bookController = {
  bookNPayment,
  paymentSuccess,
  getMyBookings,
  getPendingBookings,
  allowGuestCheckIn,
  getPendingPermits,
};
