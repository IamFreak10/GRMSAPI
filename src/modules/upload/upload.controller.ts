import { Request, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileFormat = file.mimetype.split('/')[1];

    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const finalFormat = allowedFormats.includes(fileFormat as string)
      ? fileFormat
      : 'png';

    return {
      folder: 'user_images',
      format: finalFormat,
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});
const parser = multer({ storage });

// API controller
const uploadImages = (req: Request, res: Response) => {
  try {
   
    console.log('Uploaded Files:', req.files);

    const files = req.files as any[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Field name must be "images"',
      });
    }

    const urls = files.map((file) => file.path);
    return res.status(200).json({ success: true, urls });
  } catch (error: any) {
    console.log('FULL ERROR DETAILS:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Cloudinary Upload Failed',
    });
  }
};

export { parser, uploadImages };
