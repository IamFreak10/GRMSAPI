import { Request, Response } from 'express';
import { bookingServices } from './book.service';


const bookNPayment = async (req: Request, res: Response) => {
  try {
    const paymentData = req.body;

    
    const result = await bookingServices.initiatePayment(paymentData);

    console.log('SSLCommerz Response:', result);

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

export const bookController = {
  bookNPayment,
};