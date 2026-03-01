"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImages = exports.parser = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../../config/cloudinary"));
// Multer + Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'user_images', // Cloudinary folder
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
});
const parser = (0, multer_1.default)({ storage });
exports.parser = parser;
// API controller
const uploadImages = (req, res) => {
    try {
        // Multer array ব্যবহার করলে ফাইলগুলো req.files এ থাকে
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded. Check if the field name is "images"'
            });
        }
        // Cloudinary storage ব্যবহার করলে 'path' এ URL থাকে
        const urls = files.map(file => file.path);
        return res.status(200).json({ success: true, urls });
    }
    catch (error) {
        console.error("Error in image upload:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.uploadImages = uploadImages;
//# sourceMappingURL=upload.controller.js.map