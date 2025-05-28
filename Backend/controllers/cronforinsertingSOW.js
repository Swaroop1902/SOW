/*
const axios = require('axios');
const qs = require('qs');
const pdf = require('pdf-parse');
const mysql = require('mysql2/promise');

const TENANT_ID = '';
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const SITE_DOMAIN = '';
const SITE_NAME = '';
const FOLDER_PATH = '';

// MySQL DB Config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Test_1234',
  database: 'sowapplicationdb'
};

async function getAccessToken() {
  const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const response = await axios.post(tokenEndpoint, qs.stringify({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data.access_token;
}

async function getSiteId(accessToken) {
  const siteUrl = `https://graph.microsoft.com/v1.0/sites/${SITE_DOMAIN}:/sites/${SITE_NAME}`;
  const response = await axios.get(siteUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.id;
}

async function getDefaultDriveId(accessToken, siteId) {
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const documentsDrive = response.data.value.find(drive => drive.name === 'Documents');
  if (!documentsDrive) throw new Error('Documents library not found');
  return documentsDrive.id;
}

function extractDates(text) {
  // Pattern 1: "Start Date: April 1, 2025"
  let startMatch = text.match(/start\s*date\s*[:\-]?\s*([A-Za-z]+ \d{1,2}, \d{4})/i);
  let endMatch = text.match(/end\s*date\s*[:\-]?\s*([A-Za-z]+ \d{1,2}, \d{4})/i);

  // Pattern 2: "Estimated start date ... on 04 11, 2025 ... through 08 02, 2025"
  if (!startMatch || !endMatch) {
    const altMatch = text.match(/estimated start date.*?on\s*([0-9]{2} [0-9]{2}, [0-9]{4}).*?through\s*([0-9]{2} [0-9]{2}, [0-9]{4})/is);
    if (altMatch) {
      startMatch = [, altMatch[1]];
      endMatch = [, altMatch[2]];
    }
  }

  const formatDate = (str) => {
    if (!str) return null;
    // Try "April 1, 2025"
    let date = new Date(str);
    if (!isNaN(date)) return date.toISOString().split('T')[0];
    // Try "04 11, 2025"
    const alt = str.match(/([0-9]{2}) ([0-9]{2}), ([0-9]{4})/);
    if (alt) {
      // MM DD, YYYY
      return `${alt[3]}-${alt[1]}-${alt[2]}`;
    }
    return null;
  };

  return {
    startDate: formatDate(startMatch?.[1]),
    endDate: formatDate(endMatch?.[1])
  };
}

async function downloadAndProcessPDF(file, db) {
  try {
    // Use file name (without .pdf) as projectName
    const projectName = file.name.replace(/\.pdf$/i, '');
    const stakeholders = 'Unknown';
    const deliveryManager = 'Unknown';
    const deliveryUnit = 'Unknown';
    const uploadedBy = 'system';
    const statusDetail = 'active';

    // Validate required fields
    if (!projectName || !deliveryUnit || !stakeholders || !deliveryManager) {
      console.warn(`❌ Required fields missing for file: ${file.name}`);
      return;
    }

    // Check for duplicate file
    const [existing] = await db.execute(
      'SELECT sow_id FROM sow WHERE file_name = ?',
      [file.name]
    );
    if (existing.length > 0) {
      console.log(`⏭️ Skipping duplicate: ${file.name}`);
      return;
    }

    // Download and parse PDF
    const url = file['@microsoft.graph.downloadUrl'];
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfData = await pdf(response.data);

    // Extract dates
    const { startDate, endDate } = extractDates(pdfData.text);

    if (!startDate || !endDate) {
      console.warn(`⚠️ Could not extract dates from ${file.name}`);
      return;
    }

    // Mark existing active SOW as inactive for the same project
    try {
      await db.execute(
        `UPDATE sow SET status = 0 WHERE project_name = ? AND status = 1`,
        [projectName]
      );
    } catch (err) {
      console.error(`❌ Failed to update existing SOW status for ${projectName}:`, err.message);
      return;
    }

    // Insert the new SOW into the database
    try {
      await db.execute(
        `INSERT INTO sow (
          project_name, start_date, stakeholders, end_date, delivery_manager, status, delivery_unit, uploaded_by, file_name, status_detail
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectName,
          startDate,
          stakeholders,
          endDate,
          deliveryManager,
          1, // status: 1 for active
          deliveryUnit,
          uploadedBy,
          file.name,
          statusDetail
        ]
      );
      console.log(`✅ Inserted: ${file.name}`);
    } catch (dbErr) {
      console.error(`❌ DB Insert Error for ${file.name}:`, dbErr.message);
    }
  } catch (err) {
    console.error(`❌ Error processing ${file.name}:`, err.message);
  }
}

async function processAllFiles(accessToken, driveId, db) {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${FOLDER_PATH}:/children`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const files = response.data.value;
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.pdf')) {
      await downloadAndProcessPDF(file, db);
    }
  }
}

// Exported function for cron or manual use
async function importSOWs() {
  try {
    const token = await getAccessToken();
    const siteId = await getSiteId(token);
    const driveId = await getDefaultDriveId(token, siteId);
    const db = await mysql.createConnection(dbConfig);

    await processAllFiles(token, driveId, db);

    console.log('✅ Done importing SOW PDF data into database');
    await db.end();
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

module.exports = { importSOWs };
*/

// const axios = require('axios');
// const qs = require('qs');
// const pdf = require('pdf-parse');
// const mysql = require('mysql2/promise');

// const TENANT_ID = '';
// const CLIENT_ID = '';
// const CLIENT_SECRET = '';
// const SITE_DOMAIN = '';
// const SITE_NAME = '';
// const FOLDER_PATH = '';

// // MySQL DB Config
// const dbConfig = {
//   host: 'localhost',
//   user: 'root',
//   password: 'Test_1234',
//   database: 'sowapplicationdb'
// };

// async function getAccessToken() {
//   const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
//   const response = await axios.post(tokenEndpoint, qs.stringify({
//     grant_type: 'client_credentials',
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//     scope: 'https://graph.microsoft.com/.default',
//   }), {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//   });
//   return response.data.access_token;
// }

// async function getSiteId(accessToken) {
//   const siteUrl = `https://graph.microsoft.com/v1.0/sites/${SITE_DOMAIN}:/sites/${SITE_NAME}`;
//   const response = await axios.get(siteUrl, {
//     headers: { Authorization: `Bearer ${accessToken}` }
//   });
//   return response.data.id;
// }

// async function getDefaultDriveId(accessToken, siteId) {
//   const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`;
//   const response = await axios.get(url, {
//     headers: { Authorization: `Bearer ${accessToken}` }
//   });
//   const documentsDrive = response.data.value.find(drive => drive.name === 'Documents');
//   if (!documentsDrive) throw new Error('Documents library not found');
//   return documentsDrive.id;
// }

// function extractDates(text) {
//   // Pattern 1: "Start Date: April 1, 2025"
//   let startMatch = text.match(/start\s*date\s*[:\-]?\s*([A-Za-z]+ \d{1,2}, \d{4})/i);
//   let endMatch = text.match(/end\s*date\s*[:\-]?\s*([A-Za-z]+ \d{1,2}, \d{4})/i);

//   // Pattern 2: "Estimated start date ... on 04 11, 2025 ... through 08 02, 2025"
//   if (!startMatch || !endMatch) {
//     const altMatch = text.match(/estimated start date.*?on\s*([0-9]{2} [0-9]{2}, [0-9]{4}).*?through\s*([0-9]{2} [0-9]{2}, [0-9]{4})/is);
//     if (altMatch) {
//       startMatch = [, altMatch[1]];
//       endMatch = [, altMatch[2]];
//     }
//   }

//   const formatDate = (str) => {
//     if (!str) return null;
//     // Try "April 1, 2025"
//     let date = new Date(str);
//     if (!isNaN(date)) return date.toISOString().split('T')[0];
//     // Try "04 11, 2025"
//     const alt = str.match(/([0-9]{2}) ([0-9]{2}), ([0-9]{4})/);
//     if (alt) {
//       // MM DD, YYYY
//       return `${alt[3]}-${alt[1]}-${alt[2]}`;
//     }
//     return null;
//   };

//   return {
//     startDate: formatDate(startMatch?.[1]),
//     endDate: formatDate(endMatch?.[1])
//   };
// }

// async function downloadAndProcessPDF(file, db) {
//   try {
//     // Use file name (without .pdf) as projectName
//     const projectName = file.name.replace(/\.pdf$/i, '');
//     const stakeholders = 'Unknown';
//     const deliveryManager = 'Unknown';
//     const deliveryUnit = 'Unknown';
//     const uploadedBy = 'system';
//     const statusDetail = 'active';

//     // Validate required fields
//     if (!projectName || !deliveryUnit || !stakeholders || !deliveryManager) {
//       console.warn(`❌ Required fields missing for file: ${file.name}`);
//       return;
//     }

//     // Check for duplicate file
//     const [existing] = await db.execute(
//       'SELECT sow_id FROM sow WHERE file_name = ?',
//       [file.name]
//     );
//     if (existing.length > 0) {
//       console.log(`⏭️ Skipping duplicate: ${file.name}`);
//       return;
//     }

//     // Download and parse PDF
//     const url = file['@microsoft.graph.downloadUrl'];
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     const pdfData = await pdf(response.data);

//     // Extract dates
//     const { startDate, endDate } = extractDates(pdfData.text);

//     if (!startDate || !endDate) {
//       console.warn(`⚠️ Could not extract dates from ${file.name}`);
//       return;
//     }

//     // Mark existing active SOW as inactive for the same project
//     try {
//       await db.execute(
//         `UPDATE sow SET status = 0 WHERE project_name = ? AND status = 1`,
//         [projectName]
//       );
//     } catch (err) {
//       console.error(`❌ Failed to update existing SOW status for ${projectName}:`, err.message);
//       return;
//     }

//     // Insert the new SOW into the database
//     try {
//       await db.execute(
//         `INSERT INTO sow (
//           project_name, start_date, stakeholders, end_date, delivery_manager, status, delivery_unit, uploaded_by, file_name, status_detail
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//         [
//           projectName,
//           startDate,
//           stakeholders,
//           endDate,
//           deliveryManager,
//           1, // status: 1 for active
//           deliveryUnit,
//           uploadedBy,
//           file.name,
//           statusDetail
//         ]
//       );
//       console.log(`✅ Inserted: ${file.name}`);
//     } catch (dbErr) {
//       console.error(`❌ DB Insert Error for ${file.name}:`, dbErr.message);
//     }
//   } catch (err) {
//     console.error(`❌ Error processing ${file.name}:`, err.message);
//   }
// }

// // Recursively process all PDFs in a folder and its subfolders
// async function processAllFilesRecursive(accessToken, driveId, folderPath, db) {
//   const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${folderPath}:/children`;
//   const response = await axios.get(url, {
//     headers: { Authorization: `Bearer ${accessToken}` }
//   });

//   const items = response.data.value;
//   for (const item of items) {
//     if (item.folder) {
//       // It's a folder, recurse into it
//       await processAllFilesRecursive(accessToken, driveId, `${folderPath}/${item.name}`, db);
//     } else if (item.name.toLowerCase().endsWith('.pdf')) {
//       // It's a PDF file, process it
//       await downloadAndProcessPDF(item, db);
//     }
//   }
// }

// // Exported function for cron or manual use
// /*
// async function importSOWs() {
//   try {
//     const token = await getAccessToken();
//     const siteId = await getSiteId(token);
//     const driveId = await getDefaultDriveId(token, siteId);
//     const db = await mysql.createConnection(dbConfig);

//     // Recursively process all PDFs in the folder and subfolders
//     await processAllFilesRecursive(token, driveId, FOLDER_PATH, db);

//     console.log('✅ Done importing SOW PDF data into database');
//     await db.end();
//   } catch (error) {
//     console.error('❌ Error:', error.response?.data || error.message);
//   }
// }
// */
// async function importSOWs() {
//   const jobName = "importSOWs";
//   const startTime = new Date();
//   let logId = null;
//   let db;

//   try {
//     db = await mysql.createConnection(dbConfig);

//     // Insert job log (job start)
//     const [logResult] = await db.execute(
//       `INSERT INTO job_logs (job_name, start_time, status) VALUES (?, ?, ?)`,
//       [jobName, startTime, "Running"]
//     );
//     logId = logResult.insertId;

//     const token = await getAccessToken();
//     const siteId = await getSiteId(token);
//     const driveId = await getDefaultDriveId(token, siteId);

//     // Recursively process all PDFs in the folder and subfolders
//     await processAllFilesRecursive(token, driveId, FOLDER_PATH, db);

//     // Update job log (job end, success)
//     const endTime = new Date();
//     await db.execute(
//       `UPDATE job_logs SET end_time = ?, status = ? WHERE id = ?`,
//       [endTime, "Success", logId]
//     );

//     console.log('✅ Done importing SOW PDF data into database');
//     await db.end();
//   } catch (error) {
//     const endTime = new Date();
//     if (db && logId) {
//       // Update job log (job end, error)
//       await db.execute(
//         `UPDATE job_logs SET end_time = ?, status = ?, error_message = ? WHERE id = ?`,
//         [endTime, "Error", error.response?.data || error.message, logId]
//       );
//       await db.end();
//     }
//     console.error('❌ Error:', error.response?.data || error.message);
//   }
// }

// module.exports = { importSOWs };


const axios = require('axios');
const qs = require('qs');
const pdf = require('pdf-parse');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { generateNotifications } = require('./notificationController'); // Adjust path if needed



// MySQL DB Config
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Test_1234',
  database: 'sowapplicationdb'
};

// Log file utility
function writeLog(message) {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  const logFile = path.join(logDir, 'sow_cron.log');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

async function getAccessToken() {
  const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
  const response = await axios.post(tokenEndpoint, qs.stringify({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data.access_token;
}

async function getSiteId(accessToken) {
  const siteUrl = `https://graph.microsoft.com/v1.0/sites/${SITE_DOMAIN}:/sites/${SITE_NAME}`;
  const response = await axios.get(siteUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.id;
}

async function getDefaultDriveId(accessToken, siteId) {
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const documentsDrive = response.data.value.find(drive => drive.name === 'Documents');
  if (!documentsDrive) throw new Error('Documents library not found');
  return documentsDrive.id;
}

function extractDates(text) {
  // Pattern 1: "Start Date: April 1, 2025"
  let startMatch = text.match(/start\s*date\s*[:\-]?\s*([A-Za-z]+ \d{1,2}, \d{4})/i);
  let endMatch = text.match(/end\s*date\s*[:\-]?\s*([A-Za-z]+ \d{1,2}, \d{4})/i);

  // Pattern 2: "Estimated start date ... on 04 11, 2025 ... through 08 02, 2025"
  if (!startMatch || !endMatch) {
    const altMatch = text.match(/estimated start date.*?on\s*([0-9]{2} [0-9]{2}, [0-9]{4}).*?through\s*([0-9]{2} [0-9]{2}, [0-9]{4})/is);
    if (altMatch) {
      startMatch = [, altMatch[1]];
      endMatch = [, altMatch[2]];
    }
  }

  const formatDate = (str) => {
    if (!str) return null;
    // Try "April 1, 2025"
    let date = new Date(str);
    if (!isNaN(date)) return date.toISOString().split('T')[0];
    // Try "04 11, 2025"
    const alt = str.match(/([0-9]{2}) ([0-9]{2}), ([0-9]{4})/);
    if (alt) {
      // MM DD, YYYY
      return `${alt[3]}-${alt[1]}-${alt[2]}`;
    }
    return null;
  };

  return {
    startDate: formatDate(startMatch?.[1]),
    endDate: formatDate(endMatch?.[1])
  };
}

async function downloadAndProcessPDF(file, db) {
  try {
    // Use file name (without .pdf) as projectName
    const projectName = file.name.replace(/\.pdf$/i, '');
    const stakeholders = 'Unknown';
    const deliveryManager = 'Unknown';
    const deliveryUnit = 'Unknown';
    const uploadedBy = 'system';
    const statusDetail = 'active';

    // Validate required fields
    if (!projectName || !deliveryUnit || !stakeholders || !deliveryManager) {
      const msg = `❌ Required fields missing for file: ${file.name}`;
      console.warn(msg);
      writeLog(msg);
      return;
    }

    // Check for duplicate file
    const [existing] = await db.execute(
      'SELECT sow_id FROM sow WHERE file_name = ?',
      [file.name]
    );
    if (existing.length > 0) {
      const msg = `⏭️ Skipping duplicate: ${file.name}`;
      console.log(msg);
      writeLog(`Skipping duplicate: ${file.name}`);
      return;
    }

    // Download and parse PDF
    const url = file['@microsoft.graph.downloadUrl'];
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfData = await pdf(response.data);

    // Extract dates
    const { startDate, endDate } = extractDates(pdfData.text);

    if (!startDate || !endDate) {
      const msg = `⚠️ Could not extract dates from ${file.name}`;
      console.warn(msg);
      writeLog(msg);
      return;
    }

    // Mark existing active SOW as inactive for the same project
    try {
      await db.execute(
        `UPDATE sow SET status = 0 WHERE project_name = ? AND status = 1`,
        [projectName]
      );
    } catch (err) {
      const msg = `❌ Failed to update existing SOW status for ${projectName}: ${err.message}`;
      console.error(msg);
      writeLog(msg);
      return;
    }

    // Insert the new SOW into the database
    try {
      /*
      await db.execute(
        `INSERT INTO sow (
          project_name, start_date, stakeholders, end_date, delivery_manager, status, delivery_unit, uploaded_by, file_name, status_detail
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectName,
          startDate,
          stakeholders,
          endDate,
          deliveryManager,
          1, // status: 1 for active
          deliveryUnit,
          uploadedBy,
          file.name,
          statusDetail
        ]
      );
      */
     const [insertResult] = await db.execute(
  `INSERT INTO sow (
    project_name, start_date, stakeholders, end_date, delivery_manager, status, delivery_unit, uploaded_by, file_name, status_detail
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    projectName,
    startDate,
    stakeholders,
    endDate,
    deliveryManager,
    1, // status: 1 for active
    deliveryUnit,
    uploadedBy,
    file.name,
    statusDetail
  ]
);
const sowId = insertResult.insertId;

// Generate notifications for this SOW
await generateNotifications(sowId, startDate, endDate);
      const msg = `✅ Inserted: ${file.name}`;
      console.log(msg);
      writeLog(`Inserted: ${file.name}`);
    } catch (dbErr) {
      const msg = `❌ DB Insert Error for ${file.name}: ${dbErr.message}`;
      console.error(msg);
      writeLog(msg);
    }
  } catch (err) {
    const msg = `❌ Error processing ${file.name}: ${err.message}`;
    console.error(msg);
    writeLog(msg);
  }
}

// Recursively process all PDFs in a folder and its subfolders
async function processAllFilesRecursive(accessToken, driveId, folderPath, db) {
  const url = `https://graph.microsoft.com/v1.0/drives/${driveId}/root:/${folderPath}:/children`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const items = response.data.value;
  for (const item of items) {
    if (item.folder) {
      // It's a folder, recurse into it
      await processAllFilesRecursive(accessToken, driveId, `${folderPath}/${item.name}`, db);
    } else if (item.name.toLowerCase().endsWith('.pdf')) {
      // It's a PDF file, process it
      await downloadAndProcessPDF(item, db);
    }
  }
}

// Exported function for cron or manual use
async function importSOWs() {
  const jobName = "importSOWs";
  const startTime = new Date();
  let logId = null;
  let db;

  try {
    db = await mysql.createConnection(dbConfig);

    // Insert job log (job start)
    const [logResult] = await db.execute(
      `INSERT INTO job_logs (job_name, start_time, status) VALUES (?, ?, ?)`,
      [jobName, startTime, "Running"]
    );
    logId = logResult.insertId;

    writeLog(`Job started: ${jobName}`);

    const token = await getAccessToken();
    const siteId = await getSiteId(token);
    const driveId = await getDefaultDriveId(token, siteId);

    // Recursively process all PDFs in the folder and subfolders
    await processAllFilesRecursive(token, driveId, FOLDER_PATH, db);

    // Update job log (job end, success)
    const endTime = new Date();
    await db.execute(
      `UPDATE job_logs SET end_time = ?, status = ? WHERE id = ?`,
      [endTime, "Success", logId]
    );

    const msg = '✅ Done importing SOW PDF data into database';
    console.log(msg);
    writeLog('Done importing SOW PDF data into database');
    await db.end();
  } catch (error) {
    const endTime = new Date();
    if (db && logId) {
      // Update job log (job end, error)
      await db.execute(
        `UPDATE job_logs SET end_time = ?, status = ?, error_message = ? WHERE id = ?`,
        [endTime, "Error", error.response?.data || error.message, logId]
      );
      await db.end();
    }
    const msg = `❌ Error: ${error.response?.data || error.message}`;
    console.error(msg);
    writeLog(msg);
  }
}

module.exports = { importSOWs };