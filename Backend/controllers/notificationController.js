const db = require("../config/db");
const transporter = require("../utils/mailer");
const moment = require("moment");

exports.getNotificationsBySOW = (req, res) => {
  const { sowId } = req.params;
  db.query("SELECT * FROM notifications WHERE sow_id = ?", [sowId], (err, result) => {
    if (err) return res.status(500).json({ error: "Error fetching notifications" });
    res.json(result);
  });
};

// exports.sendNotifications = () => {
//   const today = new Date().toISOString().split("T")[0];

//   db.query(
//     "SELECT n.*, u.email, s.name AS sow_name FROM notifications n JOIN users u ON n.user_id = u.id JOIN sow s ON n.sow_id = s.id WHERE n.status = 'Pending' AND n.notification_date = ?",
//     [today],
//     (err, notifications) => {
//       if (err) return console.error("Error fetching notifications", err);

//       notifications.forEach((notification) => {
//         const mailOptions = {
//           from: process.env.EMAIL_USER,
//           to: notification.email,
//           subject: `Reminder: ${notification.sow_name}`,
//           text: `Your SOW "${notification.sow_name}" is nearing expiration.`,
//         };

//         transporter.sendMail(mailOptions, (err) => {
//           const newStatus = err ? "Failed" : "Sent";
//           db.query("UPDATE notifications SET status = ? WHERE id = ?", [newStatus, notification.id]);
//         });
//       });
//     }
//   );
// };


// exports.sendNotifications = () => {
//   const today = new Date().toISOString().split("T")[0];
//   console.log("Sending notifications for date:", today);

//   db.query(
//     `SELECT 
//         s.project_name AS sow_name,
//         n.notification_id,
//         n.sow_id,
//         n.message,
//         s.stakeholders AS email,
//         s.end_date
//       FROM notifications n
//       INNER JOIN sow s ON n.sow_id = s.sow_id
//       WHERE DATE(n.notification_date) = ? AND n.status = 'Pending'`,
//     [today],
//     (err, notifications) => {
//       if (err) return console.error("Error fetching notifications", err);

//       if (notifications.length === 0) {
//         console.log("No notifications to send today.");
//         return;
//       }
//       const formattedEndDate = moment(end_date).format('DD-MM-YYYY');
//       notifications.forEach((notification) => {
//         console.log("Preparing to send email for notification:", notification);
// /*
//         const mailOptions = {
//           from: "swaroop.bidkar@harbingergroup.com",
//           to: notification.email,
//           subject: `Reminder: ${notification.sow_name}`,
//           text: `Your SOW "${notification.sow_name}" is nearing expiration.`,
//         };
// */

// const mailOptions = {
//   from: "swaroop.bidkar@harbingergroup.com",
//   to: notification.email,
//   subject: `Reminder: "${notification.project_name}" SOW - Expiring Soon`,  // Updated subject
//   html: `
//     <p>Dear Stakeholder,</p>
//     <p>This is a reminder that the Statement of Work (SOW) for <b>"${notification.project_name}"</b> is nearing its expiration.</p>

//     <h4>SOW Details:</h4>
//     <ul>
//       <li><strong>Project Name:</strong> ${notification.project_name}</li>
//       <li><strong>End Date:</strong> ${formattedEndDate}</li>  <!-- Ensure formattedEndDate is available -->
//     </ul>

//     <p>Please take necessary action before the deadline to avoid any service disruption.</p>

//     <p>Best Regards,</p>
//     <p><strong>Your Team</strong></p>
//   `,
// };


//         transporter.sendMail(mailOptions, (err, info) => {
//           const newStatus = err ? "Failed" : "Sent";

//           if (err) {
//             console.error("Failed to send email for notification_id:", notification.notification_id, err);
//           } else {
//             console.log("Email sent successfully to:", notification.email);
//           }

//           db.query(
//             "UPDATE notifications SET status = ? WHERE notification_id = ?",
//             [newStatus, notification.notification_id]
//           );
//         });
//       });
//     }
//   );
// };

exports.sendNotifications = () => {
  const today = new Date().toISOString().split("T")[0];
  console.log("Sending notifications for date:", today);

  db.query(
    `SELECT 
        s.project_name AS sow_name,
        n.notification_id,
        n.sow_id,
        n.message,
        s.stakeholders AS email,
        s.end_date
      FROM notifications n
      INNER JOIN sow s ON n.sow_id = s.sow_id
      WHERE DATE(n.notification_date) = ? AND n.status = 'Pending'`,
    [today],
    (err, notifications) => {
      if (err) return console.error("Error fetching notifications", err);

      if (notifications.length === 0) {
        console.log("No notifications to send today.");
        return;
      }

      notifications.forEach((notification) => {
        console.log("Preparing to send email for notification:", notification);

        // Format the end_date for each notification
        const formattedEndDate = moment(notification.end_date).format('DD-MM-YYYY');

        const mailOptions = {
          from: "swaroop.bidkar@harbingergroup.com",
          to: notification.email,
          subject: `Reminder: "${notification.sow_name}" SOW - Expiring Soon`,  // Fixed here
          html: `
            <p>Dear Stakeholder,</p>
            <p>This is a reminder that the Statement of Work (SOW) for <b>"${notification.sow_name}"</b> is nearing its expiration.</p>
        
            <h4>SOW Details:</h4>
            <ul>
              <li><strong>Project Name:</strong> ${notification.sow_name}</li>
              <li><strong>End Date:</strong> ${formattedEndDate}</li>
            </ul>
        
            <p>Please take necessary action before the deadline to avoid any service disruption.</p>
        
            <p>Best Regards,</p>
            <p><strong>Harbinger Group</strong></p>
          `,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          const newStatus = err ? "Failed" : "Sent";

          if (err) {
            console.error("Failed to send email for notification_id:", notification.notification_id, err);
          } else {
            console.log("Email sent successfully to:", notification.email);
          }

          db.query(
            "UPDATE notifications SET status = ? WHERE notification_id = ?",
            [newStatus, notification.notification_id]
          );
        });
      });
    }
  );
};

/*
// ✅ New: Generate notifications
exports.generateNotifications = async function generateNotifications(sow_id, start_date, end_date) {
  try {
    console.log("Generating notifications...");
    console.log("Start Date:", start_date);
    console.log("End Date:", end_date);

    const reminders = [];
    const firstReminder = moment(end_date).subtract(1, 'month').toDate();
    const secondReminder = moment(firstReminder).add(3, 'days').toDate();
    const thirdReminder = moment(secondReminder).add(5, 'days').toDate();
    const fourthReminder = moment(thirdReminder).add(1, 'week').toDate();
    const fifthReminder = moment(fourthReminder).add(1, 'week').toDate();

    reminders.push(
      [sow_id, firstReminder, '1 month before the end date.'],
      [sow_id, secondReminder, '3 days after the first reminder.'],
      [sow_id, thirdReminder, '5 days after the second reminder.'],
      [sow_id, fourthReminder, '1 week after the third reminder.'],
      [sow_id, fifthReminder, '2 weeks after the third reminder.']
    );

    const insertQuery = `
      INSERT INTO notifications (sow_id, notification_date, message)
      VALUES ?
    `;

    db.query(insertQuery, [reminders], (err, result) => {
      if (err) {
        console.error("Database error during notification insert:", err);
      } else {
        console.log("Notifications generated successfully!");
      }
    });
  } catch (err) {
    console.error("Error generating notifications:", err.message);
  }
};
*/
// ...existing code...

// ✅ New: Generate notifications

exports.generateNotifications = async function generateNotifications(sow_id, start_date, end_date) {
  try {
    console.log("Generating notifications...");
    console.log("Start Date:", start_date);
    console.log("End Date:", end_date);

    const reminders = [];
    const firstReminder = moment(end_date).subtract(1, 'month').toDate();
    const secondReminder = moment(firstReminder).add(3, 'days').toDate();
    const thirdReminder = moment(secondReminder).add(5, 'days').toDate();
    const fourthReminder = moment(thirdReminder).add(1, 'week').toDate();
    const fifthReminder = moment(fourthReminder).add(1, 'week').toDate();

    reminders.push(
      [sow_id, firstReminder, '1 month before the end date.', 1],
      [sow_id, secondReminder, '3 days after the first reminder.', 2],
      [sow_id, thirdReminder, '5 days after the second reminder.', 3],
      [sow_id, fourthReminder, '1 week after the third reminder.', 4],
      [sow_id, fifthReminder, '2 weeks after the third reminder.', 5]
    );

    const insertQuery = `
      INSERT INTO notifications (sow_id, notification_date, message, notification_number)
      VALUES ?
    `;

    db.query(insertQuery, [reminders], (err, result) => {
      if (err) {
        console.error("Database error during notification insert:", err);
      } else {
        console.log("Notifications generated successfully!");
      }
    });
  } catch (err) {
    console.error("Error generating notifications:", err.message);
  }
};