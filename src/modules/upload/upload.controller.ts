import { Request, Response } from 'express';
import multer from "multer"
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary';

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_images',             // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const parser = multer({ storage });

// API controller
const uploadImages = (req: Request, res: Response) => {
  try {
    // Multer array ব্যবহার করলে ফাইলগুলো req.files এ থাকে
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded. Check if the field name is "images"' 
      });
    }

    // Cloudinary storage ব্যবহার করলে 'path' এ URL থাকে
    const urls = files.map(file => file.path); 
    
    return res.status(200).json({ success: true, urls });
  } catch (error: any) {
    
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { parser, uploadImages };