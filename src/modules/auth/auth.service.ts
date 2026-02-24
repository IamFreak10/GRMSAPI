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
  console.log(token, user);
  return{token,user}
};

export const authService = {
  loginUser,
};
