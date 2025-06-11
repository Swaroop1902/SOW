
import React, { useState, useEffect } from "react";
import styles from "./EditSOWForm.module.css";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const EditSOWForm = ({ sowData, onClose, onSuccess, userRole }) => {
  const [formData, setFormData] = useState({ ...sowData });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // Fetch Delivery Managers from API
    const fetchManagers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/DeliveryManager`);
        setManagers(res.data || []);
      } catch (err) {
        setManagers([]);
      }
    };
    fetchManagers();
  }, []);

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
        `${API_URL}/api/updateSOW/${formData.sow_id}`,
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
            <select
              value={formData.delivery_unit || ""}
              onChange={(e) => handleChange("delivery_unit", e.target.value)}
              required
            >
              <option value="">Select Delivery Unit</option>
              <option value="DU-1">DU-1</option>
              <option value="DU-2">DU-2</option>
              <option value="DU-3">DU-3</option>
              <option value="DU-4">DU-4</option>
              <option value="DU-5">DU-5</option>
            </select>
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
            <select
              value={formData.delivery_manager || ""}
              onChange={(e) => handleChange("delivery_manager", e.target.value)}
              required
            >
              <option value="">Select Delivery Manager</option>
              {managers.map((m) => (
                <option key={m.user_id} value={`${m.First_name} ${m.Last_name}`}>
                  {m.First_name} {m.Last_name}
                </option>
              ))}
              {formData.delivery_manager &&
                !managers.some(
                  (m) =>
                    `${m.First_name} ${m.Last_name}` === formData.delivery_manager
                ) && (
                  <option value={formData.delivery_manager}>
                    {formData.delivery_manager} (Not in the list)
                  </option>
                )}
            </select>
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