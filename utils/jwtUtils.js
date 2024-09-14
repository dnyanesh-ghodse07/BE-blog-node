const jwt = require("jsonwebtoken");

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
}

function verifyToken(token){
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        return null
    }
}

module.exports = { generateToken, verifyToken };