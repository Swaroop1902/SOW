

const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Load from .env or hardcode for now
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Function for logging in a user
exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).send("Internal server error");
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    const storedHashedPassword = user.password;

    bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error");
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT with user_id
      const token = jwt.sign(
        { userId: user.user_id, email: user.email, name: `${user.First_name} ${user.Last_name}`, role: user.role }, // Include user_id in the payload
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        userInfo: {
          name: `${user.First_name} ${user.Last_name}`, // Combine first and last name
          role: user.role,
          email: user.email,
        },
      });
    });
  });
};

// Function to verify JWT token and fetch user details

exports.verifyToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    console.log("Decoded token:", decoded); // Debug the decoded token

    const query = "SELECT CONCAT(First_name, ' ', Last_name) AS name, role, email FROM users WHERE user_id = ?";
    db.query(query, [decoded.userId], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch user details" });
      }

      if (results.length === 0) {
        console.error("User not found for user_id:", decoded.userId); // Debug missing user
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const user = results[0];
      res.status(200).json({ success: true, user });
    });
  });
};

// Function to handle password reset request

exports.resetPassword = (req, res) => {
  const { token, password } = req.body;

  const query = "SELECT user_id, expires_at FROM PasswordResetTokens WHERE token = ?";
  db.query(query, [token], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const { user_id, expires_at } = results[0];

    if (new Date() > new Date(expires_at)) {
      return res.status(400).json({ error: "Token has expired." });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      const updateQuery = "UPDATE users SET password = ? WHERE user_id = ?";
      db.query(updateQuery, [hashedPassword, user_id], (err) => {
        if (err) {
          console.error("Error updating password:", err);
          return res.status(500).json({ error: "Failed to update password" });
        }

        const deleteQuery = "DELETE FROM PasswordResetTokens WHERE token = ?";
        db.query(deleteQuery, [token], (err) => {
          if (err) {
            console.error("Error deleting token:", err);
            return res.status(500).json({ error: "Failed to delete token" });
          }

          res.json({ message: "Password reset successfully!" });
        });
      });
    });
  });
};
