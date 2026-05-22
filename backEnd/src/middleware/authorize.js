const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentification requise." });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Acces refuse." });
  }

  next();
};

export default authorize;
