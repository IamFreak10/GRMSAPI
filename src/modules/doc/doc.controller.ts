import { Request, Response } from 'express';
import { uploadFileToDrive } from './doc.service';


export const uploadDocument = async (req: Request, res: Response) => {
  try {
    console.log('--- DEBUG: Controller Hit! ---');

    if (!req.file) {
      console.log('--- DEBUG: No file found in request ---');
      return res.status(400).json({
        success: false,
        message: "ফাইল পাওয়া যায়নি। দয়া করে 'document' ফিল্ডে ফাইলটি পাঠান।",
      });
    }

    console.log(`--- DEBUG: Uploading file: ${req.file.originalname} ---`);

    const driveData = await uploadFileToDrive(req.file);

    return res.status(200).json({
      success: true,
      message: 'ফাইল সফলভাবে গুগল ড্রাইভে আপলোড হয়েছে!',
      data: driveData,
    });
  } catch (error: any) {
    console.error('--- !!! Error in controller !!! ---', error.message);

    return res.status(500).json({
      success: false,
      message: 'সার্ভারে সমস্যা হয়েছে',
      error: error.message,
    });
  }
};
