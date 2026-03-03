import express from 'express';
import cors from 'cors';
import { userRoutes } from './modules/user/user.routes';
import { uploadRoute } from './modules/upload/upload.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { roomRoutes } from './modules/rooms/rooms.routes';
import { bookRoutes } from './modules/Booking/book.routes';
import loger from './middlewares/loger';
import { docRoutes } from './modules/doc/doc.routes';
import { mailRoutes } from './modules/mail/email.routes';
import passport from 'passport';
import './config/passport.config';
import { userStatRoutes } from './modules/user-stats/user-stat.routes';
import { adminStatsRoutes } from './modules/admin-stats/adminStats.routes';
export const app = express();

app.use(express.urlencoded({ extended: true }));
// parser
app.use(express.json());
// app.use(express.json()) এর ঠিক নিচে এটি যোগ করুন
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(passport.initialize());
// User routes
app.use('/users', userRoutes);
// Upload API
app.use('/upload', loger, uploadRoute);
// authroutes
app.use('/auth', authRoutes);
// rooms
app.use('/rooms', roomRoutes);

//booking
app.use('/booking', bookRoutes);

// Goole drive api
app.use('/upload-doc', loger, docRoutes);

// Send email to user
app.use('/send-reminder', mailRoutes);

// stats
app.use('/stats', userStatRoutes);

// stats-of-admin

app.use('/admin-stats', adminStatsRoutes);
app.get('/', (req, res) => {
  res.send('GRMS API Root');
});
export default app;
