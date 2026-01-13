/**
 * Response Helpers
 *
 * Standardized response functions for consistent API responses.
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {*} data - Data to send in response
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...data
  });
}

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} additionalData - Additional data to include
 */
function errorResponse(res, message, statusCode = 500, additionalData = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...additionalData
  });
}

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource that wasn't found
 */
function notFoundResponse(res, resource = 'Resource') {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
}

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {string} message - Validation error message
 * @param {Object} errors - Validation errors object
 */
function validationErrorResponse(res, message = 'Validation failed', errors = {}) {
  return res.status(400).json({
    success: false,
    message,
    errors
  });
}

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function unauthorizedResponse(res, message = 'Unauthorized') {
  return res.status(401).json({
    success: false,
    message
  });
}

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function forbiddenResponse(res, message = 'Forbidden') {
  return res.status(403).json({
    success: false,
    message
  });
}

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse
};
