/**
 * errorHandler.js
 * Campus Connect — CS3301 Experiment 6
 *
 * CENTRALIZED ERROR HANDLING MIDDLEWARE
 *
 * PURPOSE:
 *   Catches errors forwarded via next(error) from any controller.
 *   Returns consistent JSON error responses.
 *   Hides stack traces in production-style responses.
 *
 * Express identifies error-handling middleware by its 4 parameters:
 *   (err, req, res, next)
 *   The 'err' parameter is the error object passed to next(error).
 *
 * FLOW:
 *   Controller encounters error
 *     → next(error) called
 *       → Express skips remaining middleware
 *         → reaches errorHandler
 *           → sends JSON error response
 */

const errorHandler = (err, req, res, next) => {
  // Log the error internally for debugging
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected server error occurred',
    // Only expose error stack in development (not in production)
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
