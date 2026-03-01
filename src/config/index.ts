import dotenv from 'dotenv';
import path from 'path';
import bcrypT from 'bcryptjs';
dotenv.config({ path: path.join(process.cwd(), '.env') });
const config = {
  port: process.env.PORT,
  connection_string: process.env.CONNECTION_STR,
  jwtsecret: process.env.JWT_SECRET,
  backend_url: process.env.BACKEND_URL || 'http://localhost:5000',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',
};
export default config;
export { bcrypT };
