import nodemailer from 'nodemailer';
import { getBaseEmailTemplate } from './mail.template';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendUploadReminderMail = async (
  userEmail: string,
  userName: string,
  bookingDetails?: any
) => {
  const mailOptions = {
    from: `"Grmsa Team" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Payment Successful! 🎉 Your Invoice & Next Steps',
    html: getBaseEmailTemplate({
      userName,
      title: 'Payment Successful!',
      description:
        'আপনার পেমেন্টটি সফল হয়েছে। নিচে আপনার ইনভয়েস ডিটেইলস দেওয়া হলো। দ্রুত ডকুমেন্টগুলো আপলোড করে আপনার সিট নিশ্চিত করুন।',
      buttonText: '🚀 Upload Documents Now',
      buttonLink: `${process.env.FRONTEND_URL}/dashboard/upload`,

      invoiceDetails: bookingDetails
        ? {
            txnId: bookingDetails.transaction_id,
            totalAmount: bookingDetails.total_amount,
            roomId: bookingDetails.room_id,
          }
        : null,
    } as any),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`--- DEBUG: Email sent! MessageId: ${info.messageId} ---`);
    return info;
  } catch (error) {
    console.error('Email Error:', error);
    throw error;
  }
};

const sendWelcomeMail = async (userEmail: string, userName: string) => {
  //!todo: welcome mail logic
};

export const emailService = {
  sendUploadReminderMail,
  sendWelcomeMail,
};
