const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  const query = "SELECT * FROM users WHERE Email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).send("Internal server error");
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = results[0];
    console.log(user);
    const storedHashedPassword = user.password;
    console.log(storedHashedPassword);

    bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Internal server error");
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials111" });
      }

      res.status(200).json({ success: true, message: "Login successful", userId: user.id });
    });
  });
};


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

      const updateQuery = "UPDATE Users SET password = ? WHERE user_id = ?";
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