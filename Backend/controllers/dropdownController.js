const db = require("../config/db");

// GET all SOW project names
const getSOWDropdown = (req, res) => {
  const query = "select sow_id,project_name from sow";

  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching SOW dropdown:", error);
      return res.status(500).json({ error: "Failed to retrieve SOW list" });
    }
    res.json(results);
  });
};

module.exports = { getSOWDropdown };
