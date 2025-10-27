import { asyncHandler } from '../utils/apiHelpers.js';
import { successResponse } from '../utils/apiHelpers.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser(name, email, password);
  successResponse(res, result, 'User registered successfully. Please check your email to verify your account.', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  successResponse(res, result, 'Login successful');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAccessToken(refreshToken);
  successResponse(res, tokens, 'Token refreshed successfully');
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const result = await authService.verifyEmail(token);
  successResponse(res, result, 'Email verified successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  successResponse(res, result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  successResponse(res, result, 'Password reset successfully');
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
  successResponse(res, result, 'Password changed successfully');
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  successResponse(res, user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const user = await authService.updateUserProfile(req.user.id, { name });
  successResponse(res, user, 'Profile updated successfully');
});
