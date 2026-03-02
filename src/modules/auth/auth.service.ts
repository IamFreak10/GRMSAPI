import config, { bcrypT } from '../../config';
import db from '../../config/db';
import jwt from 'jsonwebtoken';

const loginUser = async (email: string, password: string) => {
  const result = await db.query(`SELECT * FROM users  WHERE email=$1`, [email]);
  //
  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];
  const isValid = await bcrypT.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwtsecret as string,
    {
      expiresIn: '7d',
    }
  );

  return { token, user };
};
// auth.service.ts
const findOrCreateGoogleUser = async (data: any) => {
  const { name, email, googleId, photoUrl, gender } = data;

  let result = await db.query('SELECT * FROM users WHERE google_id = $1', [
    googleId,
  ]);
  let user = result.rows[0];

  if (!user) {
    result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    user = result.rows[0];

    if (user) {
      await db.query(
        'UPDATE users SET google_id = $1, gender = COALESCE(gender, $2), photo_url = COALESCE(photo_url, $3) WHERE email = $4',
        [googleId, gender, photoUrl, email]
      );
      const updatedResult = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      user = updatedResult.rows[0];
    } else {
      const newUser = await db.query(
        `INSERT INTO users 
        (name, email, password, google_id, role, gender, age, phone, photo_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [name, email, null, googleId, 'user', gender, null, null, photoUrl]
      );
      user = newUser.rows[0];
    }
  }
  return { user };
};
export const authService = {
  loginUser,
  findOrCreateGoogleUser,
};
