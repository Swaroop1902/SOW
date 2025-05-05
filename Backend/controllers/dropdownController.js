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


// GET: full SOW data for auto-fill

const getFullSOWDetails = (req, res) => {
  const sowId = req.params.id; // Get the sow_id from the URL parameters

  // Validate sowId is a valid number
  if (!sowId || isNaN(sowId)) {
    return res.status(400).json({ error: "Invalid SOW ID" });
  }

  const query = `
    SELECT sow_id, project_name, delivery_unit, delivery_manager, stakeholders
    FROM sow
    WHERE sow_id = ?`; // Parameterized query to prevent SQL injection

  db.query(query, [sowId], (error, results) => {
    if (error) {
      console.error("Error fetching full SOW details:", error);
      return res.status(500).json({ error: "Failed to retrieve SOW details" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "SOW not found" });
    }

    // Clean up the stakeholders field (split by commas, remove any leading/trailing spaces)
    let stakeholders = results[0].stakeholders.trim(); // Remove leading/trailing spaces
    stakeholders = stakeholders.replace(/\t/g, ''); // Remove tabs
    stakeholders = stakeholders.split(',').map((email) => email.trim()); // Split by comma and trim spaces

    // Update stakeholders field to be an array
    results[0].stakeholders = stakeholders; 

    // Return the cleaned-up result as a JSON object
    res.json(results[0]); 
  });
};


module.exports = { getSOWDropdown ,getFullSOWDetails };
