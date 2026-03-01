import axios from 'axios';
import qs from 'qs';
import { TPaymentData } from './booking.interface';

const initiatePayment = async (paymentData: TPaymentData) => {
  const trnxid = `trn_${Date.now()}_${paymentData.userName}_${Math.floor(Math.random() * 1000000)}`;

  const initiate = {
    store_id: 'grms69a20c513ded2',
    store_passwd: 'grms69a20c513ded2@ssl',
    total_amount: paymentData.totalAmount,
    currency: 'BDT',
    tran_id: trnxid,
    success_url: 'https://grms-mjs-deployment.netlify.app/dashboard/book-room',
    fail_url: 'https://grms-mjs-deployment.netlify.app/dashboard/book-room',
    cancel_url: 'https://grms-mjs-deployment.netlify.app/dashboard/book-room',
    ipn_url: 'https://grms-mjs-deployment.netlify.app/dashboard/book-room',
    shipping_method: 'Courier',
    product_name: `Room ${paymentData.roomId}`,
    product_category: 'Room',
    product_profile: 'general',
    cus_name: paymentData.userName,
    cus_email: paymentData.email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    ship_name: 'Customer Name',
    ship_add1: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const response = await axios({
    url: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    method: 'POST',
    data: qs.stringify(initiate),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

export const bookingServices = {
  initiatePayment,
};
