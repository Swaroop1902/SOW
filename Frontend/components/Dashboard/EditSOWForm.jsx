// import React, { useState } from "react";
// import styles from "./Dashboard.module.css";
// import axios from "axios";

// const EditSOWForm = ({ sowData, onClose, onSuccess, userRole }) => {
//   console.log("EditSOWForm rendered"); // Debug: component rendered
//   const [formData, setFormData] = useState({ ...sowData });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Form submit triggered", formData); // Debug: submit triggered
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       console.log("Calling API with:", formData); // Debug: API call about to happen
//       await axios.put(
//         `http://localhost:5000/api/updateSOW/${formData.sow_id}`,
//         formData
//       );
//       setLoading(false);
//       console.log("API call successful"); // Debug: API call success
//       onSuccess && onSuccess();
//       onClose();
//     } catch (err) {
//       setLoading(false);
//       console.error("API call failed", err); // Debug: API call failed
//       alert("Failed to update SOW.");
//     }
//   };

//   return (
//     <div className={styles.modalOverlay}>
//       <div className={styles.modalContent}>
//         <button className={styles.closeBtn} onClick={onClose}>
//           ✖
//         </button>
//         <h2>Edit SOW</h2>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Project Name:
//             <input
//               type="text"
//               value={formData.project_name || ""}
//               onChange={(e) => handleChange("project_name", e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             Start Date:
//             <input
//               type="date"
//               value={formData.Start_date ? formData.Start_date.slice(0, 10) : ""}
//               onChange={(e) => handleChange("Start_date", e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             End Date:
//             <input
//               type="date"
//               value={formData.end_date ? formData.end_date.slice(0, 10) : ""}
//               onChange={(e) => handleChange("end_date", e.target.value)}
//               required
//             />
//           </label>
//           <label>
//             Delivery Unit:
//             <input
//               type="text"
//               value={formData.delivery_unit || ""}
//               onChange={(e) => handleChange("delivery_unit", e.target.value)}
//             />
//           </label>
//           <label>
//             Delivery Head:
//             <input
//               type="text"
//               value={formData.delivery_head || ""}
//               disabled
//             />
//           </label>
//           <label>
//             Delivery Manager:
//             <input
//               type="text"
//               value={formData.delivery_manager || ""}
//               onChange={(e) => handleChange("delivery_manager", e.target.value)}
//             />
//           </label>
//           <label>
//             Status:
//             <select
//               value={formData.Status || ""}
//               onChange={(e) => handleChange("Status", e.target.value)}
//             >
//               <option value="Active">Active</option>
//               <option value="About-End">About-End</option>
//               <option value="In-active">In-active</option>
//             </select>
//           </label>
//           <button
//             type="submit"
//             className={styles.actionsButton}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditSOWForm;

import React, { useState } from "react";
import styles from "./EditSOWForm.module.css";
import axios from "axios";

const EditSOWForm = ({ sowData, onClose, onSuccess, userRole }) => {
  const [formData, setFormData] = useState({ ...sowData });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/updateSOW/${formData.sow_id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      setShowConfirm(false);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setShowConfirm(false);
      alert("Failed to update SOW.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✖
        </button>
        <h2>Edit SOW</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Project Name:
            <input
              type="text"
              value={formData.project_name || ""}
              onChange={(e) => handleChange("project_name", e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Start Date:
            <input
              type="date"
              value={formData.Start_date ? formData.Start_date.slice(0, 10) : ""}
              onChange={(e) => handleChange("Start_date", e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            End Date:
            <input
              type="date"
              value={formData.end_date ? formData.end_date.slice(0, 10) : ""}
              onChange={(e) => handleChange("end_date", e.target.value)}
              required
            />
          </label>
          <label className={styles.label}>
            Delivery Unit:
            <input
              type="text"
              value={formData.delivery_unit || ""}
              onChange={(e) => handleChange("delivery_unit", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Delivery Head:
            <input
              type="text"
              value={formData.delivery_head || ""}
              disabled
            />
          </label>
          <label className={styles.label}>
            Delivery Manager:
            <input
              type="text"
              value={formData.delivery_manager || ""}
              onChange={(e) => handleChange("delivery_manager", e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Status:
            <select
              value={formData.Status || ""}
              onChange={(e) => handleChange("Status", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="About-End">About-End</option>
              <option value="In-active">In-active</option>
            </select>
          </label>
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.actionsButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      {showConfirm && (
        <div className={styles.confirmBoxOverlay}>
          <div className={styles.confirmBox}>
            <p>Are you sure you want to make changes?</p>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={loading}
            >
              Yes
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSOWForm;