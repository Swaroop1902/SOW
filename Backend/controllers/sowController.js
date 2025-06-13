const db = require("../config/db");
// const extractDateFromPDF = require("../utils/pdfParser");
const fs = require('fs');
const extractDatesFromPDF = require('../utils/pdfParser');
const { generateNotifications } = require('../controllers/notificationController');


exports.uploadSOW = async (req, res) => {
  try {
    const { projectName, deliveryUnit, stakeholders, deliveryManager ,uploaded_by } = req.body;
    let sowId = 0;

    // Validate required fields
    if (!projectName || !deliveryUnit || !stakeholders || !deliveryManager) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    // Extract start and end dates from the PDF
    const { startDate, endDate } = await extractDatesFromPDF(filePath);

    if (!startDate || !endDate) {
      fs.unlinkSync(filePath); // Clean up uploaded file
      return res.status(400).json({ error: "Failed to extract dates from PDF." });
    }

    // Mark existing Active SOW as Inactive for the same project
    const updateQuery = `UPDATE SOW SET status = 0 WHERE project_name = ? AND status = 1`;
    db.query(updateQuery, [projectName], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to update the database." });
      }
    });

    // Insert the new SOW into the database
    const query = `
      INSERT INTO SOW (
        project_name, start_date, end_date, delivery_unit, uploaded_by,
        stakeholders, file_name, delivery_manager, status, upload_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [
      projectName,
      startDate,
      endDate,
      deliveryUnit,
      uploaded_by, // uploaded_by (replace with actual user ID)
      stakeholders,
      req.file.originalname,
      deliveryManager,
      1, // status: 1 for active
    ];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error("Database error:", err);
        fs.unlinkSync(filePath); // Clean up uploaded file
        return res.status(500).json({ error: "Failed to insert into the database." });
      } else {
        sowId = result.insertId;
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      // Generate Notification
      generateNotifications(sowId, startDate, endDate);

      res.json({
        message: "SOW uploaded and updated successfully.",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    });
  } catch (err) {
    console.error("Error processing file:", err);

    // Clean up uploaded file if it exists
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Error cleaning up file:", unlinkErr);
      }
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

// Upload Addendum

exports.uploadAddendum = async (req, res) => {
  try {
    const {
      sowId,
      deliveryUnit,
      stakeholders,
      deliveryManager,
      addendumType // <-- NEW: Accepting the type from the request
    } = req.body;

    if (!sowId) {
      return res.status(400).json({ error: "sowId is required." });
    }

    if (!addendumType || !["Change Request", "Renewal"].includes(addendumType)) {
      return res.status(400).json({ error: "Valid addendumType is required." });
    }

    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    // Extract dates from PDF
    const { startDate, endDate } = await extractDatesFromPDF(filePath);

    // Prepare insert query with addendum_type
    const query = `
      INSERT INTO addendum (
        sow_id, file_name, uploaded_by, start_date, end_date,
        delivery_unit, stakeholders, delivery_manager, upload_date,
        addendum_type
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    const params = [
      sowId,
      req.file.originalname,
      1, // Replace with actual user ID
      startDate || null,
      endDate || null,
      deliveryUnit || null,
      stakeholders || null,
      deliveryManager || null,
      addendumType // <-- NEW: Added to the params
    ];

    db.query(query, params, (err, result) => {
      fs.unlinkSync(filePath); // Clean up uploaded file

      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Failed to insert addendum into DB." });
      }

      const addendumId = result.insertId;
generateNotifications(sowId, startDate, endDate);

      res.json({
        message: "Addendum uploaded successfully.",
        addendumId: result.insertId,
        startDate: startDate?.toISOString().split("T")[0] || null,
        endDate: endDate?.toISOString().split("T")[0] || null,
      });
    });
  } catch (err) {
    console.error("Error uploading addendum:", err);

    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Cleanup error:", unlinkErr);
      }
    }

    res.status(500).json({ error: "Internal server error." });
  }
};


// Fetch Delivery Managers
exports.getDeliveryManagers = (req, res) => {
  const query = `
    SELECT user_id, First_name, Last_name, email, role, delivery_unit 
    FROM users 
    WHERE role = 'Delivery Manager';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching delivery managers:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
};

//Fetching all the details of the Addendums in the SOW
exports.getAddendumsBySowId = (req, res) => {
  const { sowId } = req.params

  const query = `
    SELECT 
  addendum_id, 
  sow_id, 
  file_name, 
  uploaded_by, 
  start_date, 
  end_date, 
  delivery_unit, 
  stakeholders, 
  delivery_manager, 
  upload_date,
  addendum_type,
  CASE 
    WHEN status = 1 THEN 'Active'
    WHEN status = 2 THEN 'About-End'
    ELSE 'In-active'
  END AS status
FROM addendum 
WHERE sow_id = ?
  `

  db.query(query, [sowId], (err, results) => {
    if (err) {
      console.error('Error fetching addendums:', err)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    res.status(200).json(results)
  })
}


// Update SOW
exports.updateSOW = (req, res) => {
  const sow_id = req.params.sowId;
  const {
    project_name,
    Start_date,
    end_date,
    delivery_unit,
    delivery_manager,
    Status,
  } = req.body;

  let statusInt = 0;
  if (Status === "Active") statusInt = 1;
  else if (Status === "About-End") statusInt = 2;

  // Convert to MySQL date format
  const mysqlStartDate = toMysqlDate(Start_date);
  const mysqlEndDate = toMysqlDate(end_date);

  const query = `
    UPDATE sow
    SET project_name = ?, Start_date = ?, end_date = ?, delivery_unit = ?, delivery_manager = ?, status = ?
    WHERE sow_id = ?
  `;

  const params = [
    project_name,
    mysqlStartDate,
    mysqlEndDate,
    delivery_unit,
    delivery_manager,
    statusInt,
    sow_id,
  ];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating SOW:", err);
      return res.status(500).json({ error: "Failed to update SOW" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No SOW found with that ID" });
    }
    res.json({ message: "SOW updated successfully" });
  });
};

function toMysqlDate(dateString) {
  if (!dateString) return null;
  return dateString.slice(0, 10);
}