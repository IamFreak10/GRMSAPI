import express from 'express';
import { userRoutes } from './modules/user/user.routes';
export const app = express();

// parser
app.use(express.json());

// User routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('GRMS API Root');
});
export default app;
