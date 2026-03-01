import { Request, Response } from 'express';
import multer from "multer";
declare const parser: multer.Multer;
declare const uploadImages: (req: Request, res: Response) => Response<any, Record<string, any>>;
export { parser, uploadImages };
//# sourceMappingURL=upload.controller.d.ts.map