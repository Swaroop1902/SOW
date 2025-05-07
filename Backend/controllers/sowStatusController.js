const db = require('../config/db'); // Using mysql2 (non-promise)
const dayjs = require('dayjs');

const updateSOWStatus = (req, res) => {
  db.query(`
    SELECT
      s.sow_id,
      s.start_date AS sow_start,
      s.end_date AS sow_end,
      MAX(COALESCE(a.end_date, s.end_date)) AS effective_end_date,
      MIN(COALESCE(a.start_date, s.start_date)) AS effective_start_date
    FROM sow s
    LEFT JOIN addendum a ON s.sow_id = a.sow_id
    GROUP BY s.sow_id
  `, (err, rows) => {
    if (err) {
      console.error('Error fetching SOWs:', err);
      return res?.status?.(500).json({ message: 'DB fetch error' });
    }

    const today = dayjs();
    let pending = rows.length;

    if (pending === 0) {
      return res?.status?.(200).json({ message: 'No SOWs to update.' });
    }

    rows.forEach(row => {
      const { sow_id, effective_start_date, effective_end_date } = row;
      const start = dayjs(effective_start_date);
      const end = dayjs(effective_end_date);

      let statusDetail = 'active';
      let status = 1;

      if (today.isAfter(end)) {
        statusDetail = 'inactive';
        status = 0;
      } else if (
        today.isAfter(end.subtract(1, 'month')) &&
        today.isBefore(end) &&
        today.isAfter(start)
      ) {
        statusDetail = 'about-end';
        status = 2;
      }

      db.query(
        `UPDATE sow SET status_detail = ?, status = ? WHERE sow_id = ?`,
        [statusDetail, status, sow_id],
        (err) => {
          if (err) {
            console.error(`Failed to update SOW ${sow_id}:`, err);
          }
          pending--;
          if (pending === 0) {
            console.log('✅ All SOW statuses updated.');
            res?.status?.(200).json({ message: 'SOW status updated.' });
          }
        }
      );
    });
  });
};

module.exports = { updateSOWStatus };
