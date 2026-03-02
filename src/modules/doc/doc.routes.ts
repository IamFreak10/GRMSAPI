import express from 'express';
import { uploadDocument } from './doc.controller';
import { upload } from './doc.utils';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('admin', 'user'),
  upload.single('document'),
  uploadDocument
);

export const docRoutes = router;
