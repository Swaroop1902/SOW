const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.createUser = async (req, res) => {
  const { first_name, last_name, email, role, delivery_unit } = req.body;

  // Insert user into the database
  const query = `
    INSERT INTO users (First_name, Last_name, email, role, delivery_unit, isactive)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [first_name, last_name, email, role, delivery_unit, 0], (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({ error: "Failed to create user." });
    }

    const userId = result.insertId; // Get the inserted user's ID

    // Generate reset password token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save the token and expiry to the database
    const tokenQuery = `
      INSERT INTO PasswordResetTokens (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `;

    db.query(tokenQuery, [userId, token, tokenExpiry], (err) => {
      if (err) {
        console.error("Error saving token:", err);
        return res.status(500).json({ error: "Failed to save reset token." });
      }

      res.status(201).json({ message: "User created successfully." });
    });
  });
};
