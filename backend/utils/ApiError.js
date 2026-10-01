/**
 * Custom ApiError class extending Error.
 * Standardizes HTTP status codes and error messages across all controllers.
 * 
 * Concept:
 * When an error occurs in Express, throwing an instance of ApiError allows
 * the centralized errorMiddleware to capture the status code and return a clean JSON response.
 */
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
