// // // // import React, { useState } from "react";
// // // // import axios from "axios";
// // // // import styles from "./NotificationSettings.module.css";

// // // // const REMINDER_OPTIONS = [
// // // //   { number: 1, label: "1 month before the end date." },
// // // //   { number: 2, label: "3 days after the first reminder." },
// // // //   { number: 3, label: "5 days after the second reminder." },
// // // //   { number: 4, label: "1 week after the third reminder." },
// // // //   { number: 5, label: "2 weeks after the third reminder." },
// // // // ];

// // // // const NotificationSettings = ({ onClose }) => {
// // // //   const [selected, setSelected] = useState(null);
// // // //   const [showConfirm, setShowConfirm] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [successMsg, setSuccessMsg] = useState("");

// // // //   const handleSelect = (number) => {
// // // //     setSelected(number);
// // // //     setShowConfirm(true);
// // // //     setSuccessMsg("");
// // // //   };

// // // //   const handleConfirm = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       await axios.put(
// // // //         "http://localhost:5000/api/notifications/update",
// // // //         { notification_number: selected }
// // // //       );
// // // //       setSuccessMsg("Notification setting updated successfully!");
// // // //     } catch (err) {
// // // //       setSuccessMsg("Failed to update notification setting.");
// // // //     }
// // // //     setLoading(false);
// // // //     setShowConfirm(false);
// // // //   };

// // // //   return (
// // // //     <div className={styles.overlay}>
// // // //       <div className={styles.modal}>
// // // //         <button className={styles.closeBtn} onClick={onClose}>✖</button>
// // // //         <h2>Notification Settings</h2>
// // // //         <ul className={styles.optionsList}>
// // // //           {REMINDER_OPTIONS.map((opt) => (
// // // //             <li key={opt.number}>
// // // //               <button
// // // //                 className={styles.optionBtn}
// // // //                 onClick={() => handleSelect(opt.number)}
// // // //                 disabled={loading}
// // // //               >
// // // //                 {opt.label}
// // // //               </button>
// // // //             </li>
// // // //           ))}
// // // //         </ul>
// // // //         {showConfirm && (
// // // //           <div className={styles.confirmBox}>
// // // //             <p>
// // // //               Are you sure you want to update all SOWs' <b>{REMINDER_OPTIONS[selected - 1].label}</b> notification dates?
// // // //             </p>
// // // //             <button className={styles.confirmBtn} onClick={handleConfirm} disabled={loading}>
// // // //               {loading ? "Updating..." : "Confirm"}
// // // //             </button>
// // // //             <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)} disabled={loading}>
// // // //               Cancel
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //         {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default NotificationSettings;

// // // import React, { useState } from "react";
// // // import styles from "./NotificationSettings.module.css";

// // // const REMINDER_OPTIONS = [
// // //   { number: 1, label: "First Reminder" },
// // //   { number: 2, label: "Second Reminder" },
// // //   { number: 3, label: "Third Reminder" },
// // //   { number: 4, label: "Fourth Reminder" },
// // //   { number: 5, label: "Fifth Reminder" },
// // // ];

// // // const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);

// // // const NotificationSettings = ({ onClose }) => {
// // //   const [reminderDays, setReminderDays] = useState({
// // //     1: 30,
// // //     2: 27,
// // //     3: 22,
// // //     4: 15,
// // //     5: 8,
// // //   });

// // //   const handleChange = (reminderNumber, value) => {
// // //     setReminderDays((prev) => ({
// // //       ...prev,
// // //       [reminderNumber]: Number(value),
// // //     }));
// // //   };

// // //   const handleSave = () => {
// // //     // TODO: Implement save logic (API call)
// // //     alert("Settings saved: " + JSON.stringify(reminderDays));
// // //   };

// // //   return (
// // //     <div className={styles.overlay}>
// // //       <div className={styles.modal}>
// // //         <button className={styles.closeBtn} onClick={onClose}>✖</button>
// // //         <h2>Email Reminders</h2>
// // //         <div className={styles.reminderList}>
// // //           {REMINDER_OPTIONS.map((rem) => (
// // //             <div className={styles.reminderRow} key={rem.number}>
// // //               <span className={styles.reminderLabel}>{rem.label}</span>
// // //               <select
// // //                 className={styles.daysDropdown}
// // //                 value={reminderDays[rem.number]}
// // //                 onChange={(e) => handleChange(rem.number, e.target.value)}
// // //               >
// // //                 {daysOptions.map((d) => (
// // //                   <option key={d} value={d}>{d}</option>
// // //                 ))}
// // //               </select>
// // //               <span className={styles.beforeText}>days before end date</span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //         <div className={styles.buttonRow}>
// // //           <button className={styles.saveBtn} onClick={handleSave}>Save</button>
// // //           <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default NotificationSettings;

// // import React, { useState } from "react";
// // import axios from "axios";
// // import styles from "./NotificationSettings.module.css";

// // const REMINDER_OPTIONS = [
// //   { number: 1, label: "First Reminder" },
// //   { number: 2, label: "Second Reminder" },
// //   { number: 3, label: "Third Reminder" },
// //   { number: 4, label: "Fourth Reminder" },
// //   { number: 5, label: "Fifth Reminder" },
// // ];

// // const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);

// // const NotificationSettings = ({ onClose }) => {
// //   const [reminderDays, setReminderDays] = useState({
// //     1: 30,
// //     2: 27,
// //     3: 22,
// //     4: 15,
// //     5: 8,
// //   });
// //   const [loading, setLoading] = useState(false);
// //   const [successMsg, setSuccessMsg] = useState("");

// //   const handleChange = (reminderNumber, value) => {
// //     setReminderDays((prev) => ({
// //       ...prev,
// //       [reminderNumber]: Number(value),
// //     }));
// //   };

// //   const handleSave = async () => {
// //     setLoading(true);
// //     setSuccessMsg("");
// //     try {
// //       await axios.put(
// //         "http://localhost:5000/api/notifications/updateAllDays",
// //         { reminderDays }
// //       );
// //       setSuccessMsg("Notification settings updated successfully!");
// //     } catch (err) {
// //       setSuccessMsg("Failed to update notification settings.");
// //     }
// //     setLoading(false);
// //   };

// //   return (
// //     <div className={styles.overlay}>
// //       <div className={styles.modal}>
// //         <button className={styles.closeBtn} onClick={onClose}>✖</button>
// //         <h2>Email Reminders</h2>
// //         <div className={styles.reminderList}>
// //           {REMINDER_OPTIONS.map((rem) => (
// //             <div className={styles.reminderRow} key={rem.number}>
// //               <span className={styles.reminderLabel}>{rem.label}</span>
// //               <select
// //                 className={styles.daysDropdown}
// //                 value={reminderDays[rem.number]}
// //                 onChange={(e) => handleChange(rem.number, e.target.value)}
// //                 disabled={loading}
// //               >
// //                 {daysOptions.map((d) => (
// //                   <option key={d} value={d}>{d}</option>
// //                 ))}
// //               </select>
// //               <span className={styles.beforeText}>days before end date</span>
// //             </div>
// //           ))}
// //         </div>
// //         <div className={styles.buttonRow}>
// //           <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
// //             {loading ? "Saving..." : "Save"}
// //           </button>
// //           <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
// //             Cancel
// //           </button>
// //         </div>
// //         {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default NotificationSettings;

// import React, { useState } from "react";
// import axios from "axios";
// import styles from "./NotificationSettings.module.css";

// const REMINDER_OPTIONS = [
//   { number: 1, label: "First Reminder" },
//   { number: 2, label: "Second Reminder" },
//   { number: 3, label: "Third Reminder" },
//   { number: 4, label: "Fourth Reminder" },
//   { number: 5, label: "Fifth Reminder" },
// ];

// const daysOptions = Array.from({ length: 30 }, (_, i) => i + 1);

// const NotificationSettings = ({ onClose }) => {
//   const [reminderDays, setReminderDays] = useState({
//     1: 30,
//     2: 27,
//     3: 22,
//     4: 15,
//     5: 8,
//   });
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleChange = (reminderNumber, value) => {
//     setReminderDays((prev) => ({
//       ...prev,
//       [reminderNumber]: Number(value),
//     }));
//   };

//   const handleSave = async () => {
//     setErrorMsg("");
//     setSuccessMsg("");

//     // Validation: Each reminder must be less than the previous one
//     for (let i = 1; i < 5; i++) {
//       if (reminderDays[i] <= reminderDays[i + 1]) {
//         setErrorMsg(
//           `${REMINDER_OPTIONS[i].label} must be closer to the end date than ${REMINDER_OPTIONS[i - 1].label}.`
//         );
//         return;
//       }
//     }

//     setLoading(true);
//     try {
//       await axios.put(
//         "http://localhost:5000/api/notifications/updateAllDays",
//         { reminderDays }
//       );
//       setSuccessMsg("Notification settings updated successfully!");
//     } catch (err) {
//       setSuccessMsg("Failed to update notification settings.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
//         <button className={styles.closeBtn} onClick={onClose}>✖</button>
//         <h2>Email Reminders</h2>
//         <div className={styles.reminderList}>
//           {REMINDER_OPTIONS.map((rem) => (
//             <div className={styles.reminderRow} key={rem.number}>
//               <span className={styles.reminderLabel}>{rem.label}</span>
//               <select
//                 className={styles.daysDropdown}
//                 value={reminderDays[rem.number]}
//                 onChange={(e) => handleChange(rem.number, e.target.value)}
//                 disabled={loading}
//               >
//                 {daysOptions.map((d) => (
//                   <option key={d} value={d}>{d}</option>
//                 ))}
//               </select>
//               <span className={styles.beforeText}>days before end date</span>
//             </div>
//           ))}
//         </div>
//         {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
//         <div className={styles.buttonRow}>
//           <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </button>
//           <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>
//             Cancel
//           </button>
//         </div>
//         {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
//       </div>
//     </div>
//   );
// };

// export default NotificationSettings;

import React, { useState } from "react";
import axios from "axios";
import styles from "./NotificationSettings.module.css";

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
        "http://localhost:5000/api/notifications/updateAllDays",
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