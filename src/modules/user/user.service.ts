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
const updateProfile = async (email: string, payload: any) => {
  const { name, gender, age, phone, photo_url } = payload;

  const result = await db.query(
    `UPDATE users 
     SET name = COALESCE($1, name), 
         gender = COALESCE($2, gender), 
         age = COALESCE($3, age), 
         phone = COALESCE($4, phone), 
         photo_url = COALESCE($5, photo_url),
         updated_at = NOW()
     WHERE email = $6 
     RETURNING id, name, email, role, gender, age, phone, photo_url`,
    [name, gender, age, phone, photo_url, email]
  );

  return result.rows[0];
};
const getMyProfileByEmail = async (email: string) => {
  const result = await db.query(
    'SELECT id, name, email, role, gender, age, phone, photo_url FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};
export const userService = {
  createUser,
  updateProfile,
  getMyProfileByEmail,
};
