export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    if (req.user.role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admins only: Access denied" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
