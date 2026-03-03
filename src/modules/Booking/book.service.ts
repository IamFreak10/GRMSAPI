import axios from 'axios';
import qs from 'qs';
import db from '../../config/db';
import config from '../../config';
import { emailService } from '../mail/email.service';

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
  const userResult = await db.query(
    'SELECT name, email FROM users WHERE id = $1',
    [booking.user_id]
  );
  const user = userResult.rows[0];

  // ২. ইনভয়েস ডেটা সাজিয়ে মেইল পাঠানো
  if (user) {
    emailService
      .sendUploadReminderMail(user.email, user.name, {
        transaction_id: txnId,
        total_amount: booking.total_amount,
      })
      .catch((err) => console.error('Mail Error:', err));
  }
  return { success: true };
};

// book.service.ts
const getMyBookings = async (userId: string) => {
  const query = `
    SELECT 
        b.id,
        b.room_id,     
        b.bed_id,      
        b.check_in,
        b.check_out,
        b.transaction_id,
        b.total_amount,
        b.payment_status,
        r.room_no,
        r.branch
    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    WHERE b.user_id = $1
    ORDER BY b.id DESC`;

  const result = await db.query(query, [userId]);
  return result.rows;
};

const getPendingBookings = async (branch: string) => {
  const query = `
    SELECT 
        bk.id as booking_id, 
        u.id as user_id, 
        u.name, 
        u.gender, 
        u.document_url,      
        bk.payment_status,
        bk.is_permitted,     
        bk.check_in,
        bk.check_out,
        r.room_no,
        bk.transaction_id
    FROM bookings bk 
    JOIN users u ON bk.user_id = u.id 
    JOIN rooms r ON bk.room_id = r.id 
    WHERE r.branch = $1 
    ORDER BY bk.booking_date DESC; 
  `;
  const result = await db.query(query, [branch]);
  return result.rows;
};
const getPendingPermits = async (branch: string) => {
  const query = `
    SELECT 
        bk.id as booking_id, 
        u.name, 
        u.gender, 
        u.document_url, -- ভেরিফাই করার জন্য
        bk.payment_status,
        bk.check_in,
        bk.check_out,
        r.room_no,
        bk.transaction_id
    FROM bookings bk 
    JOIN users u ON bk.user_id = u.id 
    JOIN rooms r ON bk.room_id = r.id 
    WHERE r.branch = $1 
    AND bk.payment_status = 'paid' 
    AND bk.is_permitted = FALSE 
    ORDER BY bk.booking_date DESC;
  `;
  const result = await db.query(query, [branch]);
  return result.rows;
};

// book.service.ts

const checkInGuest = async (bookingId: string) => {
  const query = `
    UPDATE bookings 
    SET status = 'active', 
        actual_check_in = CURRENT_TIMESTAMP 
    WHERE id = $1 
    RETURNING *`;

  const result = await db.query(query, [bookingId]);
  return result.rows[0];
};

const checkOutGuest = async (bookingId: string) => {
  const query = `
    UPDATE bookings 
    SET status = 'completed', 
        actual_check_out = CURRENT_TIMESTAMP 
    WHERE id = $1 
    RETURNING *`;

  const result = await db.query(query, [bookingId]);
  return result.rows[0];
};

const getAllRoomsWithStatus = async (branch: string) => {
  const query = `
    SELECT 
        r.room_no as "roomNo",
        r.type as "type",          -- ডায়াগ্রাম অনুযায়ী r.type
        'neutral' as "roomGender", -- rooms টেবিলে gender নেই
        b.id as "bedId",
        b.bed_label as "bedLabel", -- তোর ডায়াগ্রামে bed_label আছে
        -- বুকিং থাকলে occupied true, না থাকলে false
        CASE WHEN bk.id IS NOT NULL THEN true ELSE false END as "occupied",
        u.name as "guestName",
        -- ডায়াগ্রামে না থাকলেও তোর সার্ভিসে তুই এই কলামটা ইউজ করছিস
        COALESCE(bk.is_permitted, false) as "is_permitted" 
    FROM rooms r
    LEFT JOIN beds b ON r.id = b.room_id
    LEFT JOIN bookings bk ON b.id = bk.bed_id 
        AND bk.payment_status = 'paid' 
        AND CURRENT_DATE BETWEEN bk.check_in AND bk.check_out -- আজকের স্ট্যাটাস
    LEFT JOIN users u ON bk.user_id = u.id
    WHERE r.branch = $1
    ORDER BY r.room_no, b.id;
  `;

  const result = await db.query(query, [branch]);
  const rows = result.rows;

  // ডাটা গ্রুপিং লজিক
  const floorData = rows.reduce((acc: any[], row: any) => {
    let room = acc.find((r) => r.roomNo === row.roomNo);

    if (!room) {
      room = {
        roomNo: row.roomNo,
        type: row.type,
        gender: row.roomGender,
        beds: [],
      };
      acc.push(room);
    }

    if (row.bedId) {
      room.beds.push({
        id: row.bedLabel || row.bedId, // bed_label থাকলে সেটা দেখাবে
        occupied: row.occupied,
        guest: row.guestName || null,
        is_permitted: row.is_permitted,
      });
    }

    return acc;
  }, []);

  return floorData;
};
const permitGuest = async (bookingId: string) => {
  const query = `
    UPDATE bookings 
    SET is_permitted = TRUE 
    WHERE id = $1 
    RETURNING *`;

  const result = await db.query(query, [bookingId]);
  return result.rows[0];
};

const getAllBookingsForAdmin = async () => {
  const query = `
    SELECT 
        bk.id, 
        bk.status, 
        bk.is_permitted, 
        bk.check_in, 
        bk.check_out, 
        bk.payment_status,
        bk.transaction_id, 
        r.room_no, 
        r.branch, 
        u.name as guest_name,
        u.email,
        u.gender,
        u.phone 
    FROM bookings bk
    JOIN rooms r ON bk.room_id = r.id
    JOIN users u ON bk.user_id = u.id
    ORDER BY bk.id DESC;
  `;

  const result = await db.query(query);
  return result.rows;
};
export const bookingServices = {
  initiatePayment,
  createBooking,
  completeBookingProcess,
  getMyBookings,
  getPendingBookings,
  getPendingPermits,
  permitGuest,
  getAllRoomsWithStatus,
  checkInGuest,
  checkOutGuest,
  getAllBookingsForAdmin,
};
