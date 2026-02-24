import express from 'express';
import { parser, uploadImages } from './upload.controller';

const router = express.Router();

// Maximum 10 images at a time
router.post('/', parser.array('images', 10), uploadImages);

export const uploadRoute = router;
