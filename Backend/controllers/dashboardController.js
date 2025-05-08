const db = require("../config/db");

// Admin: All SOWs (latest per project)
exports.getDashboardForAdmin = (req, res) => {
  db.query(
    `WITH RankedSOW AS (
      SELECT 
        s.sow_id, s.project_name, s.Start_date, s.end_date, s.delivery_unit,
        s.delivery_manager,
        CONCAT(u.First_name, ' ', u.Last_name) AS delivery_head,
        CASE 
          WHEN s.status = 1 THEN 'Active'
          WHEN s.status = 2 THEN 'About-End'
          ELSE 'In-active'
        END AS Status,
        ROW_NUMBER() OVER (PARTITION BY s.project_name ORDER BY s.status DESC, s.sow_id DESC) AS row_num
      FROM sow s
      LEFT JOIN users u ON s.delivery_unit = u.delivery_unit AND u.role = 'Delivery Head'
    )
    SELECT * FROM RankedSOW WHERE row_num = 1
    ORDER BY project_name`,
    (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to fetch" });
      res.json(results);
    }
  );
};

// Delivery Manager: SOWs under them
exports.getDashboardForDeliveryManager = (req, res) => {
  const {  role, name, email  } = req.user;
  console.log("role:", role); // Log role for debugging
  console.log("email:", email); // Log email for debugging  
  console.log("name:", name); // Log name for debugging
    console.log("User details:", req.user); // Log user details for debugging
  if (!name || role !== "Delivery Manager") {
    return res.status(400).json({ error: "Invalid request or role" });
  }

  db.query(
    `SELECT 
      s.sow_id, s.project_name, s.Start_date, s.end_date, s.delivery_unit,
      s.delivery_manager,
      CONCAT(u.First_name, ' ', u.Last_name) AS delivery_head,
      CASE 
        WHEN s.status = 1 THEN 'Active'
        WHEN s.status = 2 THEN 'About-End'
        ELSE 'In-active'
      END AS Status
    FROM sow s
    LEFT JOIN users u ON s.delivery_unit = u.delivery_unit AND u.role = 'Delivery Manager'
    WHERE s.delivery_manager = ?
    ORDER BY s.project_name`,
    [name],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Failed to fetch" });
      res.json(results);
      console.log("Results:", results); // Log results for debugging
    }
  );
};

// Delivery Head: SOWs under their delivery unit
exports.getDashboardForDeliveryHead = (req, res) => {
  const { email, role } = req.user;
  console.log("User details:", req.user); // Log user details for debugging
  if (!email || role !== "Delivery Head") {
    return res.status(400).json({ error: "Invalid request or role" });
  }

  db.query(
    `SELECT delivery_unit FROM users WHERE email = ? AND role = 'Delivery Head'`,
    [email],
    (err, userResults) => {
      if (err) return res.status(500).json({ error: "Failed to fetch user" });
      if (userResults.length === 0)
        return res.status(404).json({ error: "Delivery Head not found" });

      const delivery_unit = userResults[0].delivery_unit;

      db.query(
        `WITH RankedSOW AS (
          SELECT 
            s.sow_id, s.project_name, s.Start_date, s.end_date, s.delivery_unit,
            s.delivery_manager,
            CONCAT(u.First_name, ' ', u.Last_name) AS delivery_head,
            CASE 
              WHEN s.status = 1 THEN 'Active'
              WHEN s.status = 2 THEN 'About-End'
              ELSE 'In-active'
            END AS Status,
            ROW_NUMBER() OVER (PARTITION BY s.project_name ORDER BY s.status DESC, s.sow_id DESC) AS row_num
          FROM sow s
          LEFT JOIN users u ON s.delivery_unit = u.delivery_unit AND u.role = 'Delivery Head'
          WHERE s.delivery_unit = ?
        )
        SELECT * FROM RankedSOW WHERE row_num = 1
        ORDER BY project_name`,
        [delivery_unit],
        (err, results) => {
          if (err) return res.status(500).json({ error: "Failed to fetch" });
          res.json(results);
        }
      );
    }
  );
};
