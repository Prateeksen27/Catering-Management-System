import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).json({
      message: "Access denied, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // keep id since your project uses id
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    console.log("Token verified:", req.user);

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({
      message: "Invalid token",
    });
  }
};