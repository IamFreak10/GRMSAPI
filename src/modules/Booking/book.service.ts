import axios from 'axios';
import qs from 'qs';
import db from '../../config/db';
import config from '../../config';

const createBooking = async (paymentData: any, trnxid: string) => {
  // ১. একই ট্রানজ্যাকশন আইডি দিয়ে ডাটাবেসে পেন্ডিং বুকিং ক্রিয়েট

  const query = `
    INSERT INTO bookings 
    (user_id, room_id, bed_id, check_in, check_out, total_amount, transaction_id, payment_status) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

  const values = [
    paymentData.userId,
    paymentData.roomId,
    paymentData.bedId,
    paymentData.checkIn,
    paymentData.checkOut,
    paymentData.totalAmount,
    trnxid,
    'pending',
  ];

  await db.query(query, values);

  console.log(`Booking initialised in DB with ID: ${trnxid}`);
  return { success: true };
};

const initiatePayment = async (paymentData: any, trnxid: string) => {
  const baseApUrl = `${config.backend_url}/booking/payment`;
  const initiate = {
    store_id: 'grms69a20c513ded2',
    store_passwd: 'grms69a20c513ded2@ssl',
    total_amount: paymentData.totalAmount,
    currency: 'BDT',
    tran_id: trnxid,

    // নোট: সাকসেস ইউআরএল অবশ্যই ব্যাকএন্ডের এপিআই হতে হবে
    success_url: `${baseApUrl}/success?txn=${trnxid}`,
    fail_url: `${baseApUrl}/fail?txn=${trnxid}`,
    cancel_url: `${baseApUrl}/cancel?txn=${trnxid}`,
    ipn_url: `${baseApUrl}/ipn`,

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
const completeBookingProcess = async (txnId: string) => {
  // ১. বুকিং ডাটার সাথে ইউজারের জেন্ডারটাও নিয়ে আসো
  const bookingResult = await db.query(
    `SELECT b.*, u.gender 
     FROM bookings b 
     JOIN users u ON b.user_id = u.id 
     WHERE b.transaction_id = $1`,
    [txnId]
  );
  const booking = bookingResult.rows[0];

  if (!booking) throw new Error('Booking not found');

  // ২. পেমেন্ট স্ট্যাটাস আপডেট
  await db.query(
    'UPDATE bookings SET payment_status = $1 WHERE transaction_id = $2',
    ['paid', txnId]
  );

  // ৩. ডেইলি স্ট্যাটাস আপডেট (জেন্ডার লকসহ)
  let currentDate = new Date(booking.check_in);
  const endDate = new Date(booking.check_out);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];

    // assigned_gender কলামে ইউজারের জেন্ডার ঢুকিয়ে রুম লক করা হচ্ছে
    await db.query(
      `INSERT INTO room_daily_status (room_id, bed_id, user_id, booking_date, assigned_gender, is_paid) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        booking.room_id,
        booking.bed_id,
        booking.user_id,
        dateString,
        booking.gender,
        true,
      ]
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { success: true };
};

const getMyBookings = async (userId: string) => {
  const query = `
    SELECT 
        b.id,
        b.check_in,
        b.check_out,
        b.total_amount,
        b.payment_status,
        b.transaction_id,
        b.booking_date,
        r.room_no,
        r.branch,
        r.type as room_type
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = $1
    ORDER BY b.booking_date DESC`;

  const result = await db.query(query, [userId]);
  return result.rows;
};
export const bookingServices = {
  initiatePayment,
  createBooking,
  completeBookingProcess,
  getMyBookings,
};
