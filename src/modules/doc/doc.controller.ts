import { Request, Response } from 'express';
import { docService } from './doc.service'; // docService ইমপোর্ট করলাম

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    console.log('--- DEBUG: Controller Hit! ---');

    if (!req.file) {
      console.log('--- DEBUG: No file found in request ---');
      return res.status(400).json({
        success: false,
        message: "ফাইল পাওয়া যায়নি। দয়া করে 'document' ফিল্ডে ফাইলটি পাঠান।",
      });
    }

    // তোর মিডলওয়্যার থেকে ইউজার ইমেইল নিচ্ছি
    const userEmail = (req as any).user?.email;

    console.log(`--- DEBUG: Uploading file: ${req.file.originalname} ---`);

    // ১. গুগল ড্রাইভে আপলোড (docService এর মাধ্যমে)
    const driveData = await docService.uploadFileToDrive(req.file);

    // ২. যদি ড্রাইভ লিঙ্ক পাওয়া যায় এবং ইউজার ইমেইল থাকে, তবে ডাটাবেস আপডেট হবে
    if (driveData && userEmail) {
      await docService.updateUserDocumentLink(userEmail, driveData);
      console.log(`--- DEBUG: Database updated for ${userEmail} ---`);
    }

    return res.status(200).json({
      success: true,
      message: 'ফাইল সফলভাবে গুগল ড্রাইভে আপলোড হয়েছে!',
      data: driveData,
    });
  } catch (error: any) {
    console.error('--- !!! Error in controller !!! ---', error.message);

    return res.status(500).json({
      success: false,
      message: 'সার্ভারে সমস্যা হয়েছে',
      error: error.message,
    });
  }
};
