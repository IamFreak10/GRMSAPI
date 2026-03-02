import { Request, Response } from 'express';
import { emailService } from './email.service';

const triggerSuccessEmail = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res
        .status(400)
        .json({ success: false, message: 'Email and Name are required' });
    }

    await emailService.sendUploadReminderMail(email, name);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully to the user!',
    });
  } catch (error: any) {
    console.error('Email Controller Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const emailController = {
  triggerSuccessEmail,
};
