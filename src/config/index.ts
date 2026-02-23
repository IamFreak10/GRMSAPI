import dotenv from 'dotenv';
import path from 'path';
import bcrypt from "bcryptjs";
dotenv.config({ path: path.join(process.cwd(), '.env') });
const config = {
  port: process.env.PORT,
  connection_string: process.env.CONNECTION_STR
};
export default config;
export { bcrypt };
