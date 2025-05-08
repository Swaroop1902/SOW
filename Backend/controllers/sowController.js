const db = require("../config/db");
// const extractDateFromPDF = require("../utils/pdfParser");
const fs = require('fs');
const extractDatesFromPDF = require('../utils/pdfParser');
const { generateNotifications } = require('../controllers/notificationController');


exports.uploadSOW = async (req, res) => {
  try {
    const { projectName, deliveryUnit, stakeholders, deliveryManager } = req.body;
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
      1, // uploaded_by (replace with actual user ID)
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

/*
exports.uploadAddendum = async (req, res) => {
  try {
    const {
      sowId,
      deliveryUnit,
      stakeholders,
      deliveryManager,
      
    } = req.body;

    if (!sowId) {
      return res.status(400).json({ error: "sowId is required." });
    }

    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ error: "PDF file is required." });
    }

    // Extract dates from PDF
    const { startDate, endDate } = await extractDatesFromPDF(filePath);

    // Prepare insert query
    const query = `
      INSERT INTO Addendum (
        sow_id, file_name, uploaded_by, start_date, end_date,
        delivery_unit, stakeholders, delivery_manager,  upload_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?,  ?, NOW())
    `;

    const params = [
      sowId,
      req.file.originalname,
      1, // uploaded_by (replace with actual user ID from session/token)
      startDate || null,
      endDate || null,
      deliveryUnit || null,
      stakeholders || null,
      deliveryManager || null,
    ];

    db.query(query, params, (err, result) => {
      fs.unlinkSync(filePath); // Clean up uploaded file

      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Failed to insert addendum into DB." });
      }

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
*/
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
      INSERT INTO Addendum (
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


// // exports.getDashboard = (req, res) => {
// //   db.query("WITH RankedSOW AS (SELECT s.sow_id,s.project_name,s.Start_date,s.end_date,s.delivery_unit,s.delivery_manager,CONCAT(u.First_name, ' ', u.Last_name) AS delivery_head,CASE WHEN s.status = 1 THEN 'Active' ELSE 'In-active' END AS Status,ROW_NUMBER() OVER (PARTITION BY s.project_name ORDER BY s.status DESC, s.sow_id DESC) AS row_num FROM sow AS s LEFT JOIN users AS u ON s.delivery_unit = u.delivery_unit AND u.role = 'Delivery Head' ) SELECT sow_id, project_name, Start_date, end_date, delivery_unit,delivery_manager, delivery_head, Status FROM RankedSOW WHERE row_num = 1 order by project_name", (err, results) => {
// //     if (err) return res.status(500).json({ error: "Failed to fetch" });
// //     res.json(results);
// //   });
// // };

// exports.getDashboard = (req, res) => {
//   db.query(
//     `WITH RankedSOW AS (
//       SELECT 
//         s.sow_id,
//         s.project_name,
//         s.Start_date,
//         s.end_date,
//         s.delivery_unit,
//         s.delivery_manager,
//         CONCAT(u.First_name, ' ', u.Last_name) AS delivery_head,
//         CASE 
//           WHEN s.status = 1 THEN 'Active'
//           WHEN s.status = 2 THEN 'About-End'
//           ELSE 'In-active'
//         END AS Status,
//         ROW_NUMBER() OVER (PARTITION BY s.project_name ORDER BY s.status DESC, s.sow_id DESC) AS row_num
//       FROM sow AS s
//       LEFT JOIN users AS u ON s.delivery_unit = u.delivery_unit AND u.role = 'Delivery Head'
//     )
//     SELECT 
//       sow_id, 
//       project_name, 
//       Start_date, 
//       end_date, 
//       delivery_unit,
//       delivery_manager, 
//       delivery_head, 
//       Status
//     FROM RankedSOW
//     WHERE row_num = 1
//     ORDER BY project_name`,
//     (err, results) => {
//       if (err) return res.status(500).json({ error: "Failed to fetch" });
//       res.json(results);
//     }
//   );
// };


// Fetch Delivery Managers
exports.getDeliveryManagers = (req, res) => {
  const query = `
    SELECT user_id, First_name, Last_name, email, role, delivery_unit 
    FROM Users 
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
      addendum_type 
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