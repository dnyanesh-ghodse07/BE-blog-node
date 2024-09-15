const { verifyToken } = require("../utils/jwtUtils");
const User = require('../models/Users');

// protected miidleware
async function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (token) {
    try {
      const decoded = verifyToken(token);
      // adding req.user to check if user is logged in & map author(user) to blog 
      req.user = await User.findById(decoded.id);
      if (!req.user) {
        return res
          .status(401)
          .json({ status: "ERROR", message: "User not found" });
      }
      next();
    } catch (error) {
      res.status(403).json({ status: "ERROR", message: "Invalid token" });
    }
  } else {
    res.status(401).json({ status: "ERROR", message: "No token provided" });
  }
}

module.exports = { authenticateJWT };
