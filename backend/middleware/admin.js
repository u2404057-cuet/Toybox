module.exports = (req, res, next) => {
  if (req.user && (req.user.is_admin === 1 || req.user.is_admin === true)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' }
    });
  }
};
