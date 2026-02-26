import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log('token:',token);
      if (!token) {
        return res.status(500).json({
          message: 'You are not authenticated',
        });
      }
      const decodedToken = jwt.verify(
        token,
        config.jwtsecret as string
      ) as JwtPayload;
      req.user = decodedToken;
      console.log(req.user);
      if (!roles.includes(decodedToken.role)) {
        return res.status(403).json({
          sucess: false,
          message: 'You Do not Have Permission',
        });
      }
      next();
    } catch (e: any) {
      return res.status(401).json({
        sucess: false,
        message: e.message||'Invalid or Expired Token',
      });
    }
  };
};

export default auth;
