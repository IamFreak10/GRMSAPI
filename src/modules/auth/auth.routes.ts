import express from 'express';
import { authController } from './auth.controllers';
import passport from 'passport';

const router = express.Router();

router.post('/login', authController.userLogin);

// --- Notun Google Auth Routes ---
// ১. Google Login Trigger
// auth.routes.ts
router.get(
  '/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
    ], 
  })
);

// ২. Google Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  authController.googleLoginSuccess // Controller-e ei function ta banate hobe
);
export const authRoutes = router;
