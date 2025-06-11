
const db = require('../config/db');
const dayjs = require('dayjs');

const updateSOWStatus = (req, res) => {
  const today = dayjs();

  // STEP 1: Update Addendum Statuses Individually
  db.query(`SELECT addendum_id, sow_id, start_date, end_date FROM addendum`, (err, addendums) => {
    if (err) {
      console.error('Error fetching addendums:', err);
      // return res.status(500).json({ message: 'Error fetching addendums' });
    }

    const addendumStatusMap = {}; // { sow_id: [status, status, ...] }

    addendums.forEach(add => {
      const { addendum_id, sow_id, end_date } = add;
      const end = end_date ? dayjs(end_date) : null;

      let status = 1; // Active by default

      if (!end || today.isAfter(end)) {
        status = 0; // Inactive
      } else if (today.isAfter(end.subtract(1, 'month'))) {
        status = 2; // About-End
      }

      // Store status for this addendum
      if (!addendumStatusMap[sow_id]) {
        addendumStatusMap[sow_id] = [];
      }
      addendumStatusMap[sow_id].push(status);

      // Update the addendum status
      db.query(
        `UPDATE addendum SET status = ? WHERE addendum_id = ?`,
        [status, addendum_id],
        (err) => {
          if (err) {
            console.error(`Failed to update addendum ${addendum_id}:`, err);
          }
        }
      );
    });

    // STEP 2: Fetch All SOWs
    db.query(`SELECT sow_id, start_date, end_date FROM sow`, (err, sowRows) => {
      if (err) {
        console.error('Error fetching SOWs:', err);
        // return res.status(500).json({ message: 'Error fetching SOWs' });
      }

      sowRows.forEach(row => {
        const { sow_id, start_date, end_date } = row;
        let status = 1;
        let statusDetail = 'active';

        const addendumStatuses = addendumStatusMap[sow_id];

        if (!addendumStatuses || addendumStatuses.length === 0) {
          // No addendum: Apply logic based on sow dates
          const end = end_date ? dayjs(end_date) : null;

          if (!end || today.isAfter(end)) {
            status = 0;
            statusDetail = 'inactive';
          } else if (today.isAfter(end.subtract(1, 'month'))) {
            status = 2;
            statusDetail = 'about-end';
          }
        } else {
          // Has addendums: Decide status based on their statuses
          if (addendumStatuses.includes(1)) {
            status = 1;
            statusDetail = 'active';
          } else if (addendumStatuses.includes(2)) {
            status = 2;
            statusDetail = 'about-end';
          } else {
            status = 0;
            statusDetail = 'inactive';
          }
        }

        // Update SOW status
        db.query(
          `UPDATE sow SET status = ?, status_detail = ? WHERE sow_id = ?`,
          [status, statusDetail, sow_id],
          (err) => {
            if (err) {
              console.error(`Failed to update SOW ${sow_id}:`, err);
            }
          }
        );
      });

      console.log('✅ SOW and Addendum statuses updated.');
      // return res.status(200).json({ message: 'Statuses updated successfully.' });
    });
  });
};

module.exports = { updateSOWStatus };
