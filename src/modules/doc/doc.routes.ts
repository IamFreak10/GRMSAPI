import express from 'express';
import { uploadDocument } from './doc.controller';
import { upload } from './doc.utils';

const router = express.Router();

router.post('/', upload.single('document'), uploadDocument);

export const docRoutes = router;
