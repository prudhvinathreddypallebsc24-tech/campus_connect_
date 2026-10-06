// roleMiddleware.js – checks req.user.role after authMiddleware
function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = roleMiddleware;
