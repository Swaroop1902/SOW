"use client";

import React, { useState, useEffect } from "react";
import styles from "./UploadSOW.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const UploadSOW = ({ onClose ,userInfo }) => {
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [deliveryUnit, setDeliveryUnit] = useState("");
  const [deliveryManager, setDeliveryManager] = useState(""); // Holds the selected delivery manager
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderInput, setStakeholderInput] = useState("");
  const [message, setMessage] = useState("");
  const [ocrData, setOcrData] = useState({ startDate: "", endDate: "" });
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState("SOW");
  const [addendumType, setAddendumType] = useState("Change Request");
  const [sowList, setSowList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dmRes, sowRes] = await Promise.all([
          fetch(`${API_URL}/api/DeliveryManager`),
          fetch(`${API_URL}/api/sows`),
        ]);
        const dmData = await dmRes.json();
        const sowData = await sowRes.json();

        setManagers(dmData);
        setSowList(sowData);
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Failed to load required data.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return; // Do not fetch if no project is selected

      try {
        const res = await fetch(`${API_URL}/api/GetFullSowDetails/${projectId}`);
        const data = await res.json();

        if (res.ok) {
          console.log("Fetched project details:", data); // Debugging line
          setDeliveryUnit(data.delivery_unit || ""); // Correct field names
          setDeliveryManager(data.delivery_manager || ""); // Autofill delivery manager
          setStakeholders(data.stakeholders || []); // Keep as an array for internal use
          setStakeholderInput(data.stakeholders.join(", ") || ""); // Display as comma-separated string in input field

          // Check if the delivery manager exists in the fetched manager list
          if (data.delivery_manager && !managers.some(manager => manager.First_name + " " + manager.Last_name === data.delivery_manager)) {
            setManagers(prevManagers => [
              ...prevManagers,
              { First_name: data.delivery_manager.split(" ")[0], Last_name: data.delivery_manager.split(" ")[1] }
            ]);
          }
        } else {
          setMessage("Failed to fetch project details.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Error fetching project details.");
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== "application/pdf") {
      setMessage("Only PDF files allowed.");
      setFile(null);
    } else {
      setMessage("");
      setFile(selected);
    }
  };

  const handleStakeholderAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = stakeholderInput.trim();
      if (
        trimmed &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
        !stakeholders.includes(trimmed)
      ) {
        setStakeholders([...stakeholders, trimmed]);
        setStakeholderInput("");
      } else if (!trimmed) {
        setMessage("Please enter a valid email.");
      }
    }
  };

  const handleStakeholderRemove = (email) => {
    setStakeholders(stakeholders.filter((s) => s !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a valid PDF file.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    formData.append("pdf", file);
    formData.append("stakeholders", stakeholders.join(",")); // Join array into CSV string
    formData.append("deliveryUnit", deliveryUnit);
    formData.append("deliveryManager", deliveryManager);
    formData.append("type", formType);
    formData.append("uploaded_by", userInfo?.email || "Unknown");

    let endpoint = "";

    if (formType === "SOW") {
      formData.append("projectName", projectName);
      endpoint = `${API_URL}/api/upload`;
    } else {
      formData.append("sowId", projectId);
      formData.append("addendumType", addendumType); // <-- Add this line
      endpoint =
        addendumType === "Change Request"
          ? `${API_URL}/api/uploadAddendum`
          : `${API_URL}/api/uploadAddendum`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setOcrData({ startDate: data.startDate, endDate: data.endDate });
        onClose();
      } else {
        setMessage(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles["slide-out"]}>
      <div className={styles["wizard-container"]}>
        <div className={styles["wizard-header"]}>
          <h1>Upload And Manage SOW Documents</h1>
        </div>

        <div className={styles["form-section"]}>
          <label className={styles["form-label"]}>Select the type of Document</label>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              value="SOW"
              checked={formType === "SOW"}
              onChange={() => setFormType("SOW")}
            />
            SOW
          </label>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              value="Addendum"
              checked={formType === "Addendum"}
              onChange={() => setFormType("Addendum")}
            />
            Addendum
          </label>
        </div>

        {formType === "Addendum" && (
          <div className={styles["form-subtype"]}>
            <label className={styles["radio-label"]}>
              <input
                type="radio"
                name="addendumType"
                value="Change Request"
                checked={addendumType === "Change Request"}
                onChange={() => setAddendumType("Change Request")}
              />
              Change Request
            </label>
            <label className={styles["radio-label"]}>
              <input
                type="radio"
                name="addendumType"
                value="Renewal"
                checked={addendumType === "Renewal"}
                onChange={() => setAddendumType("Renewal")}
              />
              Renewal
            </label>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles["form-section"]}>
            <h3>Project Details</h3>

            <div className={styles["form-group"]}>
              <label htmlFor="project-name">Project Name</label>
              {formType === "SOW" ? (
                <input
                  type="text"
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              ) : (
                <select
                  id="project-id"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                >
                  <option value="">Select existing SOW</option>
                  {sowList.map((sow) => (
                    <option key={sow.sow_id} value={sow.sow_id}>
                      {sow.project_name.trim()}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="delivery-unit">Delivery Unit</label>
              <select
                id="delivery-unit"
                value={deliveryUnit}
                onChange={(e) => setDeliveryUnit(e.target.value)}
                required
              >
                <option value="">Select Delivery Unit</option>
                <option value="DU-1">Unit 1</option>
                <option value="DU-2">Unit 2</option>
                <option value="DU-3">Unit 3</option>
                <option value="DU-4">Unit 4</option>
                <option value="DU-5">Unit 5</option>
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="delivery-manager">Delivery Manager</label>
              <select
                id="delivery-manager"
                value={deliveryManager}
                onChange={(e) => setDeliveryManager(e.target.value)}
                required
              >
                <option value="">Select Delivery Manager</option>
                {managers.map((m) => (
                  <option key={m.user_id} value={`${m.First_name} ${m.Last_name}`}>
                    {m.First_name} {m.Last_name}
                  </option>
                ))}
                {deliveryManager && !managers.some(m => `${m.First_name} ${m.Last_name}` === deliveryManager) && (
                  <option value={deliveryManager} className={styles["new-manager"]}>
                    {deliveryManager} (Not in the list)
                  </option>
                )}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="stakeholders">Stakeholders</label>
              <input
                type="text"
                id="stakeholders"
                value={stakeholderInput}
                onChange={(e) => setStakeholderInput(e.target.value)}
                onKeyDown={handleStakeholderAdd}
                placeholder="Enter email and press Enter or comma"
              />
              <div className={styles["chip-container"]}>
                {stakeholders.map((email, i) => (
                  <div key={i} className={styles["chip"]}>
                    {email}
                    <span
                      className={styles["close"]}
                      onClick={() => handleStakeholderRemove(email)}
                    >
                      &times;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${styles["form-section"]} ${styles["file-upload"]}`}>
            <p>Drag and drop your PDF files here, or</p>
            <label htmlFor="file-upload">Browse Files</label>
            <input
              type="file"
              id="file-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            <p>Maximum file size: 10MB</p>
          </div>

          <div className={styles["actions"]}>
            <button type="submit" className={styles["continue-btn"]} disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload and Process"}
            </button>
            <button type="button" className={styles["continue-btn"]} onClick={onClose} disabled={isLoading}>
              Close
            </button>
          </div>
        </form>
      </div>

      {message && <p className={styles["message"]}>{message}</p>}

      {ocrData.startDate && ocrData.endDate && (
        <div className={styles["ocr-results"]}>
          <h3>Extracted Dates</h3>
          <p><strong>Start Date:</strong> {ocrData.startDate}</p>
          <p><strong>End Date:</strong> {ocrData.endDate}</p>
        </div>
      )}
    </div>
  );
};

export default UploadSOW;
