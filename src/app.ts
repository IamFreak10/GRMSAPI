import express from 'express';
import cors from 'cors';
import { userRoutes } from './modules/user/user.routes';
import { uploadRoute } from './modules/upload/upload.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { roomRoutes } from './modules/rooms/rooms.routes';
import { bookRoutes } from './modules/Booking/book.routes';
export const app = express();

app.use(express.urlencoded());
// parser
app.use(express.json());
// app.use(express.json()) এর ঠিক নিচে এটি যোগ করুন
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Body:', req.body); // এখানে দেখতে পারবেন ডাটা আসছে কি না
  next();
});
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
// User routes
app.use('/users', userRoutes);
// Upload API
app.use('/upload', uploadRoute);
// authroutes
app.use('/auth', authRoutes);
// rooms
app.use('/rooms', roomRoutes);

//booking
app.use('/booking', bookRoutes);
app.get('/', (req, res) => {
  res.send('GRMS API Root');
});
export default app;
