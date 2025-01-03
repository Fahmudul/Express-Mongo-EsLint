import { User } from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TLoginUser } from './auth.interface';
import config from '../../config';
import { authUtils } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';
const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ id: payload?.id });
  if (!user) throw new Error('User does not exist');
  if (user.isDeleted) throw new Error('User is deleted');
  const userStatus = user?.status;
  if (userStatus === 'blocked') throw new Error('User is blocked');
  if (user.password !== payload.password) throw new Error('Invalid password');
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const accessToken = authUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expirity as string,
  );

  const refreshToken = authUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expirity as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  console.log('from service', userData, payload);
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) throw new Error('User does not exist');
  const isOldPasswordCorrect = await User.isPasswordMatched(
    payload.oldPassword,
    user.password,
  );
  if (!isOldPasswordCorrect) throw new Error('Old password is incorrect');
  // Change password
  const result = await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: payload.newPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
  console.log(result);
  return result;
  // await user.save();
};

const refreshToken = async (token: string) => {
  // checking refresh token is valid
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);
  const { userId, role } = decoded as JwtPayload;
  const user = await User.isUserExistsByCustomId(userId);
  if (!user) throw new Error('User does not exist');
  if (user.isDeleted) throw new Error('User is deleted');
  if (user.status === 'blocked') throw new Error('User is blocked');
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = authUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expirity as string,
  );

  return {
    accessToken,
  };
};
const forgotPassword = async (userId: string) => {
  // console.log('from service', typeof userId);
  const user = await User.findOne({ id: userId });
  console.log(user);
  if (!user) throw new Error('User does not exist');
  console.log(user.email);
  if (user.isDeleted) throw new Error('User is deleted');
  if (user.status === 'blocked') throw new Error('User is blocked');
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };
  const resetToken = authUtils.createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );
  const resetlink = `http://localhost:3000?id=${user.id}&token=${resetToken}`;
  console.log(resetlink);
  sendEmail({ email: user.email, resetPasswordLink: resetlink });
  return resetlink;
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) throw new Error('User does not exist');
  if (user.isDeleted) throw new Error('User is deleted');
  if (user.status === 'blocked') throw new Error('User is blocked');
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  if (decoded.userId !== payload.id) throw new Error('you are forbidden');
  await User.findOneAndUpdate(
    { id: decoded.userId, role: decoded.role },
    {
      password: payload.newPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );
};
export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword
};
