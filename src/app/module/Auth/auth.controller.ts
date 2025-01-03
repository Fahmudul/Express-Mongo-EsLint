import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.services';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
  });
  res.status(httpStatus.OK).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  // console.log(req.user, req.body);
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(req.user, passwordData);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log('refreshToken', refreshToken);
  const result = await AuthServices.refreshToken(refreshToken);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { id: userId } = req.body;
  const result = await AuthServices.forgotPassword(userId);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Reset link is generated successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await AuthServices.resetPassword(req.body, token);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});
export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
