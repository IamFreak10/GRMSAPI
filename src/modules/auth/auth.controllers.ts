import { Request, Response } from 'express';
import { authService } from './auth.service';

const userLogin = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password
    );
    if (!result) {
      return res.status(404).json({
        scuccess: false,
        message: 'User Not Found',
      });
    }
    res.status(201).json({
      success: true,
      message: 'Login successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(201).json({
      sucess: false,
      message: err.message,
    });
  }
};

export const authController = {
  userLogin,
};
