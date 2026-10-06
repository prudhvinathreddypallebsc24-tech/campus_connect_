// errorHandler.js – centralized 4-argument error middleware
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    details: err.details || null,
  });
}

module.exports = errorHandler;
