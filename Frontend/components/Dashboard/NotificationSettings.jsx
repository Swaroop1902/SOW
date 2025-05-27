import React, { useState } from "react";
import axios from "axios";
import styles from "./NotificationSettings.module.css";

const REMINDER_OPTIONS = [
  { number: 1, label: "1 month before the end date." },
  { number: 2, label: "3 days after the first reminder." },
  { number: 3, label: "5 days after the second reminder." },
  { number: 4, label: "1 week after the third reminder." },
  { number: 5, label: "2 weeks after the third reminder." },
];

const NotificationSettings = ({ onClose }) => {
  const [selected, setSelected] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSelect = (number) => {
    setSelected(number);
    setShowConfirm(true);
    setSuccessMsg("");
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/update",
        { notification_number: selected }
      );
      setSuccessMsg("Notification setting updated successfully!");
    } catch (err) {
      setSuccessMsg("Failed to update notification setting.");
    }
    setLoading(false);
    setShowConfirm(false);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>Notification Settings</h2>
        <ul className={styles.optionsList}>
          {REMINDER_OPTIONS.map((opt) => (
            <li key={opt.number}>
              <button
                className={styles.optionBtn}
                onClick={() => handleSelect(opt.number)}
                disabled={loading}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
        {showConfirm && (
          <div className={styles.confirmBox}>
            <p>
              Are you sure you want to update all SOWs' <b>{REMINDER_OPTIONS[selected - 1].label}</b> notification dates?
            </p>
            <button className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
              {loading ? "Updating..." : "Confirm"}
            </button>
            <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)} disabled={loading}>
              Cancel
            </button>
          </div>
        )}
        {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
      </div>
    </div>
  );
};

export default NotificationSettings;

