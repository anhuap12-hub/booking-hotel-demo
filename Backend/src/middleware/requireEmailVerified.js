import User from "../models/User.js";

export const requireEmailVerified = async (req, res, next) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id).select("emailVerified");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before continuing",
      });
    }
    next();
  } catch (error) {
    console.error("requireEmailVerified error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
