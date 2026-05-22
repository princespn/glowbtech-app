import { Request, Response } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// 1. Define custom Mongoose methods interface for strict type checking
interface IUserDocument {
  _id: any;
  id: string;
  email: string;
  role: string;
  tokenVersion: number;
  isActive: boolean;
  getPublicProfile(): any;
  comparePassword(password: string): Promise<boolean>;
}

// Extend Express Request type to include the authenticated user payload cleanly
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    tokenVersion: number;
  };
}

// Generate JWT Token - Universal Strict Mode Bypass
const generateToken = (user: any): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_glowbtech';

  const payload = {
    id: String(user._id || user.id),
    email: String(user.email),
    role: String(user.role || 'user'),
    tokenVersion: Number(user.tokenVersion ?? 0)
  };

  // Explicitly casting jwt to 'any' stops TypeScript from checking the 5 overloads
  return (jwt as any).sign(
    payload, 
    secret, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Send token response utility handler
const sendTokenResponse = (
  user: any,
  statusCode: number,
  res: Response,
  message: string = 'Success'
): void => {
  const token = generateToken(user);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: typeof user.getPublicProfile === 'function' ? user.getPublicProfile() : user
  });
};

// @desc Register user with email/password
// @route POST /api/auth/register
// @access Public
export const register = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user instance securely
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      provider: 'local',
      tokenVersion: 0
    });

    sendTokenResponse(user, 201, res, 'User registered successfully');

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc Login user with email/password
// @route POST /api/auth/login
// @access Public
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include password flag selection
    const rawUser = await User.findOne({
      email: email.toLowerCase()
    }).select('+password');

    if (!rawUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✨ TYPE SAFETY BRIDGE: Explicitly assert the user document type
    const user = rawUser as unknown as IUserDocument;

    // Check active account structural logic flag
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Compare password using custom schema method - Now perfectly typed
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    sendTokenResponse(user, 200, res, 'Login successful');

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc OAuth login/register
// @route POST /api/auth/oauth
// @access Public
export const oauth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, provider, socialId, avatar } = req.body;

    // Find existing user across matching arrays
    let user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { socialId, provider }
      ]
    });

    if (user) {
      let updated = false;

      // Update socialId safely if empty
      if (!user.socialId && socialId) {
        user.socialId = socialId;
        user.provider = provider;
        updated = true;
      }

      // Update avatar reference string safely
      if (!user.avatar && avatar) {
        user.avatar = avatar;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    } else {
      // Create new clean profile record instance for OAuth integration
      user = await User.create({
        email: email.toLowerCase(),
        provider,
        socialId,
        avatar: avatar || null,
        tokenVersion: 0
      });
    }

    sendTokenResponse(user, 200, res, 'OAuth authentication successful');

  } catch (error: any) {
    console.error('OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OAuth authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc Get current user profile profile details
// @route GET /api/auth/me
// @access Private
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const rawUser = await User.findById(req.user.id);
    
    if (!rawUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // ✨ TYPE SAFETY BRIDGE: Assert the custom schema methods
    const user = rawUser as unknown as IUserDocument;

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile'
    });
  }
};

// @desc Logout user (Increments token version to immediately invalidate active JWTs)
// @route POST /api/auth/logout
// @access Private
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Invalidate tokens instantly across devices by modifying target database model value
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { tokenVersion: 1 }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};