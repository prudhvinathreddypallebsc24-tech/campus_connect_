/**
 * notFound.js
 * Campus Connect — CS3301 Experiment 6
 *
 * 404 NOT FOUND MIDDLEWARE
 *
 * PURPOSE:
 *   Catches any request that did not match a registered route.
 *   Placed AFTER all route registrations in server.js.
 *
 * EXAMPLE:
 *   GET /api/unknown → reaches this middleware → 404 response
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
