function authorize(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Authentication is required.'
  });
}

module.exports = authorize;
