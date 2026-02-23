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
    console.error('Error in userPost:', e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const userController = {
  userPost,
};