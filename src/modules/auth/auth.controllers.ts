import { Request, Response } from 'express';
import { authService } from './auth.service';
import config from '../../config';
import jwt from 'jsonwebtoken';

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

// auth.controllers.ts
// auth.controllers.ts
const googleLoginSuccess = async (req: Request, res: Response) => {
  try {
    const user = req.user as any; 

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`
      );
    }

    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtsecret as string,
      { expiresIn: '7d' }
    );

    
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender, // এই যে এখন আসবে
      age: user.age,
      phone: user.phone,
      photo_url: user.photo_url,
      is_active: user.is_active,
    };

    const userJson = encodeURIComponent(JSON.stringify(userData));

    // রিডাইরেক্ট
    res.redirect(
      `${process.env.FRONTEND_URL}/login-success?token=${token}&user=${userJson}`
    );
  } catch (err) {
    console.error('Redirect error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};
export const authController = {
  userLogin,
  googleLoginSuccess,
};
