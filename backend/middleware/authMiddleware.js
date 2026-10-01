const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Authentication Middleware (protect)
 * 
 * Concept:
 * 1. Checks for the Bearer token in the 'Authorization' header.
 * 2. Decodes and verifies the token with JWT_SECRET.
 * 3. Fetches the active user from MongoDB by decoded user ID.
 * 4. Ensures the user still exists and is not suspended.
 * 5. Attaches `req.user` to the request object for subsequent controller handlers.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication token missing or invalid. Please log in.'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillbridge_super_secret_jwt_key_2026_dev_mode_change_in_prod'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'The account belonging to this token no longer exists.'));
    }

    if (user.isSuspended) {
      return next(new ApiError(403, 'Your account has been suspended by an administrator.'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired session token. Please log in again.'));
  }
};

module.exports = { protect };
