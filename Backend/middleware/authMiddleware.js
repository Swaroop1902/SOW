const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded; // userId, email, etc.
    next();
  });
};

