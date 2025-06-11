
import React, { useState } from "react";
import axios from "axios";
import styles from "./NotificationSettings.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const REMINDER_OPTIONS = [
  { number: 1, label: "First Reminder" },
  { number: 2, label: "Second Reminder" },
  { number: 3, label: "Third Reminder" },
  { number: 4, label: "Fourth Reminder" },
  { number: 5, label: "Fifth Reminder" },
];

const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);
const DEFAULT_DAYS = { 1: 30, 2: 27, 3: 22, 4: 15, 5: 8 };

const NotificationSettings = ({ onClose }) => {
  const [reminderDays, setReminderDays] = useState({ ...DEFAULT_DAYS });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleChange = (reminderNumber, value) => {
    setReminderDays((prev) => ({
      ...prev,
      [reminderNumber]: Number(value),
    }));
  };

  const handleSave = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    setShowReset(false);

    // Validation: Each reminder must be less than the previous one
    for (let i = 1; i < 5; i++) {
      if (reminderDays[i] <= reminderDays[i + 1]) {
        setErrorMsg(
          `${REMINDER_OPTIONS[i].label} must be closer to the end date than ${REMINDER_OPTIONS[i - 1].label}.`
        );
        setShowReset(true);
        return;
      }
    }

    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/notifications/updateAllDays`,
        { reminderDays }
      );
      setSuccessMsg("Notification settings updated successfully!");
    } catch (err) {
      setSuccessMsg("Failed to update notification settings.");
    }
    setLoading(false);
  };

  const handleResetDefaults = (e) => {
    if (e.target.checked) {
      setReminderDays({ ...DEFAULT_DAYS });
      setErrorMsg("");
      setShowReset(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2 className={styles.modalTitle}>Email Reminders</h2>
        <div className={styles.reminderList}>
          {REMINDER_OPTIONS.map((rem) => (
            <div className={styles.reminderRow} key={rem.number}>
              <span className={styles.reminderLabel}>{rem.label}</span>
              <select
                className={styles.daysDropdown}
                value={reminderDays[rem.number]}
                onChange={(e) => handleChange(rem.number, e.target.value)}
                disabled={loading}
              >
                {daysOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <span className={styles.beforeText}>days before end date</span>
            </div>
          ))}
        </div>
        {errorMsg && (
          <div className={styles.errorMsg}>
            {errorMsg}
            {showReset && (
              <div style={{ marginTop: "0.7rem" }}>
                <label>
                  <input
                    type="checkbox"
                    onChange={handleResetDefaults}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Reset to default values
                </label>
              </div>
            )}
          </div>
        )}
        <div className={styles.buttonRow}>
          <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
      </div>
    </div>
  );
};

export default NotificationSettings;