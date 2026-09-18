/**
 * logger.js
 * Campus Connect — CS3301 Experiment 6
 *
 * REQUEST LOGGER MIDDLEWARE
 *
 * PURPOSE:
 *   Demonstrates middleware in Express.
 *   Every incoming HTTP request passes through this function BEFORE
 *   reaching the route handler.
 *
 * MIDDLEWARE FLOW:
 *   Client → express.json() → logger → route → controller → response
 *
 * Express middleware signature: (req, res, next)
 *   req  = the incoming request object
 *   res  = the outgoing response object
 *   next = function to pass control to the NEXT middleware or route
 */

const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  // Log format: [TIMESTAMP] METHOD /path
  console.log(`[${timestamp}] ${method} ${url}`);

  // IMPORTANT: call next() to pass control to the next middleware.
  // Without this, the request would hang and never reach the route.
  next();
};

module.exports = logger;
