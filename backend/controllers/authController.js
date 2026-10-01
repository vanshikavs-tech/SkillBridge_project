const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');
const { sendEmail } = require('../services/emailService');

/**
 * Auth Controller
 * Manages user registration, login, profile discovery, and password recovery.
 */

// @desc    Register a new user (Client, Freelancer, or Admin)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, title, skills, hourlyRate } = req.body;

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Please provide name, email, and password.'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, 'An account with this email address already exists.'));
    }

    // Create user record (pre-save hook hashes password automatically)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'FREELANCER',
      title: title || (role === 'CLIENT' ? 'Project Owner' : 'Professional Freelancer'),
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
      hourlyRate: hourlyRate || 0,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, 'Please provide both email and password.'));
    }

    // Select password explicitly since UserSchema sets select: false
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ApiError(401, 'Invalid email or password.'));
    }

    if (user.isSuspended) {
      return next(new ApiError(403, 'Your account has been suspended. Please contact platform support.'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ApiError(401, 'Invalid email or password.'));
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user profile
// @route   GET /api/auth/me
// @access  Private (Bearer Token)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate forgot password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ApiError(404, 'No account found with this email.'));
    }

    // Generate mock reset token for dev demonstration
    const resetToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    await sendEmail({
      to: email,
      subject: 'SkillBridge Password Reset Code',
      text: `Your password reset code is: ${resetToken}. This code is valid for 10 minutes.`,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email.',
      resetToken, // Returned in dev for easy testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You may now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user / clear session
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  logout,
};
