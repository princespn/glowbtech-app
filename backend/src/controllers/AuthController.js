import User from "../models/User.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js"; // 👈 Path check karlein

/**
 * @desc    Register new user node instance
 * @route   POST /api/auth/register
 * access  Public
 */
export const register = asyncErrorHandler(async (req, res, next) => {
  const { name, email, mobile, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Configuration setup rejected: Email and Password are required fields."
    });
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({ 
      success: false, 
      message: "User account identity node already configured with this email." 
    });
  }

  const newUser = new User({
    name: name || null,
    email: email.toLowerCase().trim(),
    mobile: mobile || null,
    password: password,
    provider: "local"
  });

  await newUser.save();

  res.status(201).json({
    success: true,
    message: "User registration verification success.",
    glowbtech_user_id: newUser._id
  });
});

/**
 * @desc    Login user session & mint token access credentials
 * @route   POST /api/auth/login
 * access  Public
 */
export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Identity verification failed: Email and Password parameters missing."
    });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid credential logs: Identity not found." 
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid credential logs: Password mismatch detected." 
    });
  }

  const token = user.generateJWT();

  res.status(200).json({
    success: true,
    message: "Authentication sequence established. Token runtime live.",
    token,
    glowbtech_user_id: user._id,
    user: user.getPublicProfile()
  });
});

/**
 * @desc    Fetch target profile session blueprint dataset
 * @route   GET /api/auth/me
 * access  Private
 */
export const getMe = asyncErrorHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ 
      success: false, 
      message: "Session mismatch error: Context extraction failed." 
    });
  }

  const userInstance = await User.findById(req.user.id);
  if (!userInstance) {
    return res.status(404).json({ 
      success: false, 
      message: "Target user reference profile record clean drops." 
    });
  }

  res.status(200).json({
    success: true,
    user: userInstance.getPublicProfile()
  });
});

/**
 * @desc    OAuth payload integration adapter node
 * @route   POST /api/auth/oauth
 * access  Public
 */
export const oauth = asyncErrorHandler(async (req, res, next) => {
  const { provider, socialId, email, name, avatar } = req.body;

  if (!provider || !socialId) {
    return res.status(400).json({ success: false, message: "Missing social provider metrics mapping." });
  }

  let user = await User.findBySocialId(provider, socialId);

  if (!user) {
    if (email) {
      user = await User.findByEmail(email);
    }

    if (user) {
      user.socialId = socialId;
      user.provider = provider;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    } else {
      user = new User({
        name,
        email: email || `${socialId}@glowbtech.oauth.node`,
        provider,
        socialId,
        avatar,
        isActive: true
      });
      await user.save();
    }
  }

  const token = user.generateJWT();

  res.status(200).json({
    success: true,
    message: "OAuth federated validation link successful.",
    token,
    glowbtech_user_id: user._id,
    user: user.getPublicProfile()
  });
});

/**
 * @desc    Terminate state token session pipeline tracking reference
 * @route   POST /api/auth/logout
 * access  Private
 */
export const logout = asyncErrorHandler(async (req, res, next) => {
  if (req.user && req.user.id) {
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
  }

  res.status(200).json({
    success: true,
    message: "Server token node reference revoked successfully. Clear local client storage cache arrays."
  });
});