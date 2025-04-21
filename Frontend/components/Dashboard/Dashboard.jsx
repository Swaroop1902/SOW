// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import UploadSOW from "./UploadSOW";
// import AddNewUser from "./AddNewUser";
// import styles from "./Dashboard.module.css";
// import axios from "axios";

// const Dashboard = () => {
//   const [isSlideoutOpen, setSlideoutOpen] = useState(false);
//   const [isHamburgerOpen, setHamburgerOpen] = useState(false);
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [selectedSow, setSelectedSow] = useState(null);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     }).format(date);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/dashboard");
//         const data = await response.json();
//         setDashboardData(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleShowNotifications = async (sowId) => {
//     setSelectedSow(sowId);
//     setNotificationSlideoutOpen(true);

//     try {
//       const response = await axios.get(`http://localhost:3000/notifications/${sowId}`);
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setNotifications([]);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className={styles.dashboardContainer}>
//       <div className={styles.header}>
//         <div className={styles.hamburgerMenu} onClick={() => setHamburgerOpen(!isHamburgerOpen)}>
//           ☰
//         </div>
//         <h1>SOW Information</h1>
//         <div className={styles.actions}>
//           <button className={styles.actionsButton} onClick={() => setSlideoutOpen(true)}>
//             Upload SOW
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className={styles.tableContainer}>
//         <table>
//           <thead>
//             <tr>
//               <th>Project Name</th>
//               <th>Start Date</th>
//               <th>End Date</th>
//               <th>Delivery Unit</th>
//               <th>Delivery Head</th>
//               <th>Delivery Manager</th>
//               <th>Status</th>
//               <th>Notifications</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dashboardData.length > 0 ? (
//               dashboardData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.project_name || "N/A"}</td>
//                   <td>{formatDate(row.Start_date)}</td>
//                   <td>{formatDate(row.end_date)}</td>
//                   <td>{row.delivery_unit || "N/A"}</td>
//                   <td>{row.delivery_head || "N/A"}</td>
//                   <td>{row.delivery_manager || "N/A"}</td>
//                   <td>
//                     <span className={`status ${row.Status?.toLowerCase() || "unknown"}`}>
//                       {row.Status || "Unknown"}
//                     </span>
//                   </td>
//                   <td>
//                     <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
//                       🔔
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8">No data available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {isSlideoutOpen && (
//         <div className={styles.slideoutPanel}>
//           <UploadSOW onClose={() => setSlideoutOpen(false)} />
//         </div>
//       )}

//       {isAddUserModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button onClick={() => setAddUserModalOpen(false)}>✖</button>
//             <AddNewUser onClose={() => setAddUserModalOpen(false)} />
//           </div>
//         </div>
//       )}

//       {isNotificationSlideoutOpen && (
//         <div className="notification-slideout open">
//           <div className="notification-header">
//             <h2>Notifications</h2>
//             <button onClick={() => setNotificationSlideoutOpen(false)}>✖</button>
//           </div>
//           <div className="notification-body">
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <div key={index} className={`notification-card ${notification.type}`}>
//                   <strong>{notification.title}</strong>
//                   <p>{notification.message}</p>
//                   <span className="date">{formatDate(notification.notification_date)}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No notifications available.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


// "use client";

// import React, { useState, useEffect } from "react";
// import UploadSOW from "./UploadSOW";
// import AddNewUser from "./AddNewUser";
// import styles from "./Dashboard.module.css";
// import axios from "axios";

// const Dashboard = () => {
//   const [isSlideoutOpen, setSlideoutOpen] = useState(false);
//   const [isHamburgerOpen, setHamburgerOpen] = useState(false);
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [selectedSow, setSelectedSow] = useState(null);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     }).format(date);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/dashboard");
//         const data = await response.json();
//         setDashboardData(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load dashboard data. Please try again later.");
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleShowNotifications = async (sowId) => {
//     setSelectedSow(sowId);
//     setNotificationSlideoutOpen(true);

//     try {
//       const response = await axios.get(`http://localhost:3000/notifications/${sowId}`);
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setNotifications([]);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p className="error">{error}</p>;

//   return (
//     <div className={styles.dashboardContainer}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div className={styles.hamburgerMenu} onClick={() => setHamburgerOpen(!isHamburgerOpen)}>
//           ☰
//         </div>
//         <h1>SOW Information</h1>
//         <div className={styles.actions}>
//           <button className={styles.actionsButton} onClick={() => setSlideoutOpen(true)}>
//             Upload SOW
//           </button>
//         </div>
//       </div>

//       {/* Hamburger Menu Slideout */}
//       {isHamburgerOpen && (
//         <div className={styles.hamburgerSlideout}>
//           <div className={styles.hamburgerHeader}>
//             <h2>Menu</h2>
//             <button className={styles.closeBtn} onClick={() => setHamburgerOpen(false)}>✖</button>
//           </div>
//           <ul className={styles.menuOptions}>
//             <li onClick={() => { setAddUserModalOpen(true); setHamburgerOpen(false); }}>
//               👤 Add New User
//             </li>
//             <li onClick={() => { /* Add logout logic if needed */ }}>
//               🚪 Logout
//             </li>
//           </ul>
//         </div>
//       )}

//       {/* Data Table */}
//       <div className={styles.tableContainer}>
//         <table>
//           <thead>
//             <tr>
//               <th>Project Name</th>
//               <th>Start Date</th>
//               <th>End Date</th>
//               <th>Delivery Unit</th>
//               <th>Delivery Head</th>
//               <th>Delivery Manager</th>
//               <th>Status</th>
//               <th>Notifications</th>
//             </tr>
//           </thead>
//           <tbody>
//             {dashboardData.length > 0 ? (
//               dashboardData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row.project_name || "N/A"}</td>
//                   <td>{formatDate(row.Start_date)}</td>
//                   <td>{formatDate(row.end_date)}</td>
//                   <td>{row.delivery_unit || "N/A"}</td>
//                   <td>{row.delivery_head || "N/A"}</td>
//                   <td>{row.delivery_manager || "N/A"}</td>
//                   <td>
//                     <span className={`status ${row.Status?.toLowerCase() || "unknown"}`}>
//                       {row.Status || "Unknown"}
//                     </span>
//                   </td>
//                   <td>
//                     <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
//                       🔔
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8">No data available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Upload SOW Slideout */}
//       {isSlideoutOpen && (
//         <div className={styles.slideoutPanel}>
//           <UploadSOW onClose={() => setSlideoutOpen(false)} />
//         </div>
//       )}

//       {/* Add New User Modal */}
//       {isAddUserModalOpen && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <button className={styles.closeBtn} onClick={() => setAddUserModalOpen(false)}>✖</button>
//             <AddNewUser onClose={() => setAddUserModalOpen(false)} />
//           </div>
//         </div>
//       )}

//       {/* Notification Slideout */}
//       {isNotificationSlideoutOpen && (
//         <div className={styles.notificationSlideout}>
//           <div className={styles.notificationHeader}>
//             <h2>Notifications</h2>
//             <button className={styles.closeBtn} onClick={() => setNotificationSlideoutOpen(false)}>✖</button>
//           </div>
//           <div className={styles.notificationBody}>
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <div key={index} className={`${styles.notificationCard} ${notification.type}`}>
//                   <strong>{notification.title}</strong>
//                   <p>{notification.message}</p>
//                   <span className={styles.date}>{formatDate(notification.notification_date)}</span>
//                 </div>
//               ))
//             ) : (
//               <p>No notifications available.</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


"use client";

import React, { useState, useEffect } from "react";
import UploadSOW from "./UploadSOW";
import AddNewUser from "./AddNewUser";
import styles from "./Dashboard.module.css";
import axios from "axios";

const handleLogout = () => {
  // Clear local storage (or cookies, depending on your auth method)
  localStorage.removeItem("token"); // adjust the key if different
  // Redirect to login page
  window.location.href = "/login";
};

const Dashboard = () => {
  const [isSlideoutOpen, setSlideoutOpen] = useState(false);
  const [isHamburgerOpen, setHamburgerOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedSow, setSelectedSow] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleShowNotifications = async (sowId) => {
    setSelectedSow(sowId);
    setNotificationSlideoutOpen(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${sowId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.hamburgerMenu} onClick={() => setHamburgerOpen(!isHamburgerOpen)}>
          ☰
        </div>
        <h1>SOW Information</h1>
        <div className={styles.actions}>
          <button className={styles.actionsButton} onClick={() => setSlideoutOpen(true)}>
            Upload SOW
          </button>
        </div>
      </div>

      {/* Hamburger Menu Slideout */}
      {isHamburgerOpen && (
        <div className={styles.hamburgerSlideout}>
          <div className={styles.hamburgerHeader}>
            <h2>Menu</h2>
            <button className={styles.closeBtn} onClick={() => setHamburgerOpen(false)}>✖</button>
          </div>
          <ul className={styles.menuOptions}>
            <li onClick={() => { setAddUserModalOpen(true); setHamburgerOpen(false); }}>
              👤 Add New User
            </li>
            <li onClick={handleLogout}>
              🚪 Logout
            </li>
          </ul>
        </div>
      )}

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Delivery Unit</th>
              <th>Delivery Head</th>
              <th>Delivery Manager</th>
              <th>Status</th>
              <th>Notifications</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.length > 0 ? (
              dashboardData.map((row, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td>{row.project_name || "N/A"}</td>
                  <td>{formatDate(row.Start_date)}</td>
                  <td>{formatDate(row.end_date)}</td>
                  <td>{row.delivery_unit || "N/A"}</td>
                  <td>{row.delivery_head || "N/A"}</td>
                  <td>{row.delivery_manager || "N/A"}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        row.Status?.toLowerCase() === "active"
                          ? styles.active
                          : styles["in-active"]
                      }`}
                    >
                      {row.Status || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
                      🔔
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload SOW Slideout */}
      {isSlideoutOpen && (
        <div className={styles.slideoutPanel}>
          <UploadSOW onClose={() => setSlideoutOpen(false)} />
        </div>
      )}

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setAddUserModalOpen(false)}>✖</button>
            <AddNewUser onClose={() => setAddUserModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Notification Slideout */}
      {isNotificationSlideoutOpen && (
        <div className={styles.notificationSlideout}>
          <div className={styles.notificationHeader}>
            <h2>Notifications</h2>
            <button className={styles.closeBtn} onClick={() => setNotificationSlideoutOpen(false)}>✖</button>
          </div>
          <div className={styles.notificationBody}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div key={index} className={`${styles.notificationCard} ${styles[notification.type]}`}>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <span className={styles.date}>{formatDate(notification.notification_date)}</span>
                </div>
              ))
            ) : (
              <p>No notifications available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
