import express from 'express';

import {
  register,
  login,
  oauth,
  getMe,
  logout
} from './AuthController.js';

import {
  protect
} from '../middleware/auth.js';

import {
  validateRegistration,
  validateLogin,
  validateOAuth
} from '../middleware/validation.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user with email/password
// @access  Public
router.post(
  '/register',
  validateRegistration,
  register
);

// @route   POST /api/auth/login
// @desc    Login user with email/password
// @access  Public
router.post(
  '/login',
  validateLogin,
  login
);

// @route   POST /api/auth/oauth
// @desc    OAuth login/register
// @access  Public
router.post(
  '/oauth',
  validateOAuth,
  oauth
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get(
  '/me',
  protect,
  getMe
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post(
  '/logout',
  protect,
  logout
);

export default router;