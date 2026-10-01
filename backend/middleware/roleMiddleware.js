const ApiError = require('../utils/ApiError');

/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Concept:
 * Ensures the currently authenticated `req.user` holds one of the required roles.
 * Example: `authorize('CLIENT')` or `authorize('ADMIN')` or `authorize('CLIENT', 'ADMIN')`.
 * 
 * @param  {...string} roles - Permitted user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'User authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Forbidden: Your role (${req.user.role}) does not have permission to access this resource.`
        )
      );
    }

    next();
  };
};

module.exports = { authorize };
