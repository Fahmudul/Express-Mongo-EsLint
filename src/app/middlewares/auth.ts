import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../module/user/user.interface';
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // Check if the token is present
    if (!token) {
      throw new Error('Unauthorized access');
    }
    // Check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new Error('Unauthorized access');
        }
        req.user = decoded as JwtPayload;
        const role = (decoded as JwtPayload).role;
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new Error('You dont have access');
        }
        next();
      },
    );
  });
};

export default auth;
