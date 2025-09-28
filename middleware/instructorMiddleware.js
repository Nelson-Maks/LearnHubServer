const instructorMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

export default instructorMiddleware;