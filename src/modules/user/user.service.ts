import { bcrypT } from '../../config';
import db from '../../config/db';
import IUserPayload from './IUserPayload';

const createUser = async (payload: IUserPayload) => {
  const {
    name,
    email,
    password,
    role = 'user',
    gender,
    age,
    phone,
    photo_url,
  } = payload;

  // Hash password
  const hashedPassword = await bcrypT.hash(password, 10);

  try {
    const result = await db.query(
      `INSERT INTO users 
      (name, email, password, role, gender, age, phone, photo_url) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
      RETURNING id, name, email, role, gender, age, phone, photo_url, created_at`,
      [name, email, hashedPassword, role, gender, age, phone, photo_url]
    );

    // Return single row directly
    return result.rows[0];
  } catch (error) {
    
    throw error;
  }
};

export const userService = {
  createUser,
};