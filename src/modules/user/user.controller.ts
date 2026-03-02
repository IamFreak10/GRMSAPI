import { Request, Response } from 'express';
import { userService } from './user.service';

const userPost = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    // তোর মিডলওয়্যার decodedToken টা req.user এ রাখছে
    const user = (req as any).user;

    // টোকেন থেকে ইমেইল নিয়ে ডাটাবেস থেকে ফ্রেশ ডাটা আনা ভালো
    const result = await userService.getMyProfileByEmail(user.email);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const result = await userService.updateProfile(user.email, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const userController = {
  userPost,
  getMe,
  updateMe,
};
