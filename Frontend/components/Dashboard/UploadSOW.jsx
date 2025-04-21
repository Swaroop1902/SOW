"use client";

import React, { useState, useEffect } from "react";
import styles from "./UploadSOW.module.css";

const UploadSOW = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [deliveryUnit, setDeliveryUnit] = useState("");
  const [deliveryManager, setDeliveryManager] = useState("");
  const [stakeholders, setStakeholders] = useState([]);
  const [stakeholderInput, setStakeholderInput] = useState("");
  const [message, setMessage] = useState("");
  const [ocrData, setOcrData] = useState({ startDate: "", endDate: "" });
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveryManagers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/DeliveryManager`);
        if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        setManagers(data);
      } catch (error) {
        console.error("Failed to fetch delivery managers:", error);
        setMessage("Unable to fetch delivery managers. Please try again later.");
      }
    };

    fetchDeliveryManagers();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      setFile(null);
    } else {
      setMessage("");
      setFile(selectedFile);
    }
  };

  const handleStakeholderAdd = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedInput = stakeholderInput.trim();
      if (
        trimmedInput &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedInput) &&
        !stakeholders.includes(trimmedInput)
      ) {
        setStakeholders([...stakeholders, trimmedInput]);
        setStakeholderInput("");
      } else if (!trimmedInput) {
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
      setMessage("Please select a valid PDF file to upload.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("stakeholders", stakeholders.join(","));
    formData.append("projectName", projectName);
    formData.append("deliveryUnit", deliveryUnit);
    formData.append("deliveryManager", deliveryManager);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setOcrData({ startDate: data.startDate, endDate: data.endDate });
        onClose();
      } else {
        setMessage(data.error || "An error occurred while processing the file.");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setMessage("An error occurred. Please try again later.");
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

      <form onSubmit={handleSubmit}>
        <div className={styles["form-section"]}>
          <h3>Project Details</h3>
          <div className={styles["form-group"]}>
            <label htmlFor="project-name">Project Name</label>
            <input
              type="text"
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
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
              {stakeholders.map((email, index) => (
                <div key={index} className={styles["chip"]}>
                  {email}
                  <span className={styles["close"]} onClick={() => handleStakeholderRemove(email)}>
                    &times;
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles["form-section"] + " " + styles["file-upload"]}>
          <p>Drag and drop your PDF files here, or</p>
          <label htmlFor="file-upload">Browse Files</label>
          <input type="file" id="file-upload" accept="application/pdf" onChange={handleFileChange} required />
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
