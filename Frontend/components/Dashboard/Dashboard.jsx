// "use client";

// import React, { useState, useEffect } from "react";
// import UploadSOW from "./UploadSOW";
// import AddNewUser from "./AddNewUser";
// import styles from "./Dashboard.module.css";
// import axios from "axios";
// import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

// const handleLogout = () => {
//   localStorage.removeItem("token");
//   window.location.href = "/login";
// };

// const Dashboard = () => {
//   const [isSlideoutOpen, setSlideoutOpen] = useState(false);
//   const [isHamburgerOpen, setHamburgerOpen] = useState(false);
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] =
//     useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [selectedSow, setSelectedSow] = useState(null);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [detailedData, setDetailedData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [latestRenewalDates, setLatestRenewalDates] = useState({});
//   const [userInfo, setUserInfo] = useState({
//     name: "",
//     role: "",
//     email: "",
//     avatar: "",
//   });

//   const [sortField, setSortField] = useState(null);
//   const [sortDirection, setSortDirection] = useState("asc");

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     }).format(date);
//   };

//   const handleSort = (field) => {
//     // If clicking the same field, toggle direction
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       // New field, set to ascending by default
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   const sortData = (data) => {
//     if (!sortField) return data;

//     return [...data].sort((a, b) => {
//       // Handle null or undefined values
//       const aValue = a[sortField] || "";
//       const bValue = b[sortField] || "";

//       // Handle date fields
//       if (sortField === "Start_date" || sortField === "end_date") {
//         const dateA = aValue ? new Date(aValue).getTime() : 0;
//         const dateB = bValue ? new Date(bValue).getTime() : 0;

//         return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
//       }

//       // Handle string fields
//       if (typeof aValue === "string" && typeof bValue === "string") {
//         return sortDirection === "asc"
//           ? aValue.localeCompare(bValue)
//           : bValue.localeCompare(aValue);
//       }

//       // Handle numeric fields
//       return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
//     });
//   };

//   // Fetch user role from API
//   const getUserRole = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.href = "/login";
//       return null;
//     }

//     try {
//       const response = await axios.get("http://localhost:5000/api/get-role", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       return response.data.role;
//     } catch (err) {
//       console.error("Error fetching user role:", err);
//       setError("Failed to fetch user role. Please try again later.");
//       return null;
//     }
//   };

//   // Fetch dashboard data based on user role
//   const fetchDashboardData = async (role) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       let endpoint = "";

//       // Determine the appropriate API endpoint based on role
//       switch (role) {
//         case "Admin":
//           endpoint = "http://localhost:5000/api/dashboard";
//           break;
//         case "Delivery Head":
//           endpoint = "http://localhost:5000/api/dashboard/delivery-head";
//           break;
//         case "Delivery Manager":
//           endpoint = "http://localhost:5000/api/dashboard/delivery-manager";
//           break;
//         default:
//           setError("Invalid user role. Please contact an administrator.");
//           setLoading(false);
//           return;
//       }

//       const response = await axios.get(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setDashboardData(response.data);

//       // After fetching dashboard data, fetch addendum data for each SOW
//       if (response.data && response.data.length > 0) {
//         const renewalDates = {};

//         // Process each SOW one by one
//         for (const row of response.data) {
//           if (row.sow_id) {
//             try {
//               const addendumResponse = await axios.get(
//                 `http://localhost:5000/api/getAddendumsBySowId/${row.sow_id}`,
//                 {
//                   headers: { Authorization: `Bearer ${token}` },
//                 }
//               );
//               const addendums = addendumResponse.data;

//               // Find the latest renewal end date
//               let latestDate = null;
//               for (const addendum of addendums) {
//                 if (addendum.addendum_type === "Renewal" && addendum.end_date) {
//                   const endDate = new Date(addendum.end_date);
//                   if (!latestDate || endDate > latestDate) {
//                     latestDate = endDate;
//                   }
//                 }
//               }

//               if (latestDate) {
//                 renewalDates[row.sow_id] = latestDate.toISOString();
//                 console.log(
//                   `Found latest renewal date for SOW ${
//                     row.sow_id
//                   }: ${latestDate.toISOString()}`
//                 );
//               }
//             } catch (err) {
//               console.error(
//                 `Error fetching addendums for SOW ${row.sow_id}:`,
//                 err
//               );
//             }
//           }
//         }

//         console.log("All latest renewal dates:", renewalDates);
//         setLatestRenewalDates(renewalDates);
//       }

//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching dashboard data:", err);
//       setError("Failed to load dashboard data. Please try again later.");
//       setLoading(false);
//     }
//   };

//   const verifyToken = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }

//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/verify-token",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Token is valid", token);
//       setUserInfo({
//         name: response.data.user.name,
//         role: response.data.user.role,
//         email: response.data.user.email,
//       });
//       console.log("User info:", response.data.user);

//       // Fetch dashboard data based on user role
//       await fetchDashboardData(response.data.user.role);
//     } catch (err) {
//       console.error("Error verifying token:", err);
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//   };

//   useEffect(() => {
//     // Verify token and fetch user info on component mount
//     verifyToken();
//   }, []);

//   /*
//   const handleShowNotifications = async (sowId) => {
//     setSelectedSow(sowId);
//     setNotificationSlideoutOpen(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:5000/api/notifications/${sowId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setNotifications([]);
//     }
//   };
//   */
//  const handleShowNotifications = async (sowId) => {
//   setSelectedSow(sowId);
//   setNotificationSlideoutOpen(true);

//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(
//       `http://localhost:5000/api/notifications/${sowId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     // Map status to type for coloring
//     const notificationsWithType = response.data.map((n) => ({
//       ...n,
//       type:
//         n.status === "Sent"
//           ? "success"
//           : n.status === "Pending"
//           ? "warning"
//           : "info", // fallback
//     }));
//     setNotifications(notificationsWithType);
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     setNotifications([]);
//   }
// };

//   const toggleAccordion = async (index, sowId) => {
//     if (expandedRow === index) {
//       setExpandedRow(null);
//     } else {
//       setExpandedRow(index);

//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `http://localhost:5000/api/getAddendumsBySowId/${sowId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log("Addendum data for SOW", sowId, ":", response.data);
//         setDetailedData(response.data);
//       } catch (error) {
//         console.error("Error fetching addendum data:", error);
//         setDetailedData([]);
//       }
//     }
//   };

//   const filteredDashboardData = dashboardData.filter((row) => {
//     const searchFields = [
//       row.project_name,
//       row.Start_date,
//       row.end_date,
//       row.delivery_unit,
//       row.delivery_head,
//       row.delivery_manager,
//       row.Status,
//     ];

//     return searchFields.some((field) =>
//       field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   const sortedAndFilteredData = sortData(filteredDashboardData);

//   // Render loading state
//   if (loading) {
//     return (
//       <div className={styles.loadingContainer}>
//         <Loader2 className={styles.spinner} />
//         <p>Loading dashboard data...</p>
//       </div>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <p className={styles.error}>{error}</p>
//         <button className={styles.retryButton} onClick={verifyToken}>
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // Render fallback UI if no data is available
//   // if (!dashboardData || dashboardData.length === 0) {
//   //   return (
//   //     <div className={styles.noDataContainer}>
//   //       <p>No dashboard data available for your role: {userInfo.role}</p>
//   //       <button className={styles.refreshButton} onClick={verifyToken}>
//   //         Refresh
//   //       </button>
//   //     </div>
//   //   )
//   // }

//   return (
//     <div className={styles.dashboardContainer}>
//       <div className={styles.header}>
//         <div
//           className={styles.hamburgerMenu}
//           onClick={() => setHamburgerOpen(!isHamburgerOpen)}
//         >
//           ☰
//         </div>
//         <h1>SOW Information</h1>
//         <div className={styles.userInfo}>
//           <span className={styles.userRole}>{userInfo.role}</span>
//           <span className={styles.userName}>{userInfo.name}</span>
//         </div>
//         <div className={styles.searchContainer}>
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className={styles.searchInput}
//           />
//         </div>
//         <div className={styles.actions}>
//           <button
//             className={styles.actionsButton}
//             onClick={() => setSlideoutOpen(true)}
//           >
//             Upload Document
//           </button>
//         </div>
//       </div>

//       {isHamburgerOpen && (
//         <div className={styles.hamburgerSlideout}>
//           <div className={styles.hamburgerHeader}>
//             <h2>Menu</h2>
//             <button
//               className={styles.closeBtn}
//               onClick={() => setHamburgerOpen(false)}
//             >
//               ✖
//             </button>
//           </div>
//           <ul className={styles.menuOptions}>
//                         {(userInfo.role === "Admin" || userInfo.role === "Delivery Head") && (
//               <li
//                 onClick={() => {
//                   setAddUserModalOpen(true);
//                   setHamburgerOpen(false);
//                 }}
//               >
//                 👤 Add New User
//               </li>
//             )}
//             <li onClick={handleLogout}>🚪 Logout</li>
//           </ul>
//         </div>
//       )}

//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th
//                 onClick={() => handleSort("project_name")}
//                 className={styles.sortableHeader}
//               >
//                 Project Name
//                 {sortField === "project_name" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th
//                 onClick={() => handleSort("Start_date")}
//                 className={styles.sortableHeader}
//               >
//                 Start Date
//                 {sortField === "Start_date" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th
//                 onClick={() => handleSort("end_date")}
//                 className={styles.sortableHeader}
//               >
//                 End Date
//                 {sortField === "end_date" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th
//                 onClick={() => handleSort("delivery_unit")}
//                 className={styles.sortableHeader}
//               >
//                 Delivery Unit
//                 {sortField === "delivery_unit" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th
//                 onClick={() => handleSort("delivery_head")}
//                 className={styles.sortableHeader}
//               >
//                 Delivery Head
//                 {sortField === "delivery_head" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th
//                 onClick={() => handleSort("delivery_manager")}
//                 className={styles.sortableHeader}
//               >
//                 Delivery Manager
//                 {sortField === "delivery_manager" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th
//                 onClick={() => handleSort("Status")}
//                 className={styles.sortableHeader}
//               >
//                 Status
//                 {sortField === "Status" && (
//                   <span className={styles.sortIndicator}>
//                     {sortDirection === "asc" ? " ▲" : " ▼"}
//                   </span>
//                 )}
//               </th>
//               <th>Notifications</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedAndFilteredData.length > 0 ? (
//               sortedAndFilteredData.map((row, index) => {
//                 // Check if this SOW has a renewal date
//                 const hasRenewalDate = latestRenewalDates[row.sow_id];
//                 const displayEndDate = hasRenewalDate
//                   ? latestRenewalDates[row.sow_id]
//                   : row.end_date;

//                 return (
//                   <React.Fragment key={index}>
//                     <tr className={styles.tableRow}>
//                       <td className={styles.projectNameCell}>
//                         <div className={styles.projectNameWrapper}>
//                           <span
//                             className={styles.expandIcon}
//                             onClick={() => toggleAccordion(index, row.sow_id)}
//                           >
//                             {expandedRow === index ? (
//                               <ChevronUp size={16} />
//                             ) : (
//                               <ChevronDown size={16} />
//                             )}
//                           </span>
//                           <span>{row.project_name || "N/A"}</span>
//                         </div>
//                       </td>
//                       <td>{formatDate(row.Start_date)}</td>
//                       <td>
//                         {formatDate(displayEndDate)}
//                         {hasRenewalDate && (
//                           <span
//                             className={styles.renewalIndicator}
//                             title="Updated from latest renewal"
//                             style={{ marginLeft: "5px", color: "green" }}
//                           >
//                             .
//                           </span>
//                         )}
//                       </td>
//                       <td>{row.delivery_unit || "N/A"}</td>
//                       <td>{row.delivery_head || "N/A"}</td>
//                       <td>{row.delivery_manager || "N/A"}</td>
//                       <td>
//                         <span
//                           className={`${styles.status} ${
//                             row.Status?.toLowerCase() === "active"
//                               ? styles.active
//                               : row.Status?.toLowerCase() === "about-end"
//                               ? styles.aboutEnd
//                               : styles["in-active"]
//                           }`}
//                         >
//                           {row.Status || "Unknown"}
//                         </span>
//                       </td>
//                       <td>
//                         <span
//                           role="button"
//                           onClick={() => handleShowNotifications(row.sow_id)}
//                         >
//                           🔔
//                         </span>
//                          <span
//     role="button"
//     onClick={() => handleEditSOW(row.sow_id)}
//     title="Edit SOW"
//     style={{ cursor: "pointer" }}
//   >
//     ✏️
//   </span>
//                       </td>
//                     </tr>
//                     {expandedRow === index && (
//                       <tr>
//                         <td colSpan="8" className={styles.expandedContent}>
//                           <div className={styles.expandedTable}>
//                             <table>
//                               <tbody>
//                                 {/* {detailedData.length > 0 ? (
//                                   detailedData.map((item, itemIndex) => (
//                                     <tr key={itemIndex}>
//                                       <td>
//                                         {item.addendum_type === "Change Request" ? (
//                                           <span className={styles.addendumIcon + " " + styles.changeRequest}>🛠️ </span>
//                                         ) : item.addendum_type === "Renewal" ? (
//                                           <span className={styles.addendumIcon + " " + styles.renewal}>♻️ </span>
//                                         ) : (
//                                           ""
//                                         )}
//                                         {row.project_name || "N/A"}
//                                       </td>
//                                       <td>{formatDate(item.start_date)}</td>
//                                       <td>{formatDate(item.end_date)}</td>
//                                       <td>{item.delivery_unit || "N/A"}</td>
//                                       <td>{row.delivery_head || "N/A"}</td>
//                                       <td>{row.delivery_manager || row.delivery_manager || "N/A"}</td>
//                                       <td>
//                                         <span
//                                           className={`${styles.status} ${
//                                             row.Status?.toLowerCase() === "active"
//                                               ? styles.active
//                                               : row.Status?.toLowerCase() === "about-end"
//                                                 ? styles.aboutEnd
//                                                 : styles["in-active"]
//                                           }`}
//                                         >
//                                           {row.Status || "Unknown"}
//                                         </span>
//                                       </td>
//                                       <td>
//                                         <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
//                                           🔔
//                                         </span>
//                                       </td>
//                                     </tr>
//                                   ))
//                                 ) : (
//                                   <tr>
//                                     <td colSpan="8">No addendum data available</td>
//                                   </tr>
//                                 )} */}
//                                 {detailedData.length > 0 ? (
//                                   detailedData.map((item, itemIndex) => (
//                                     <tr key={itemIndex}>
//                                       <td>
//                                         {item.addendum_type ===
//                                         "Change Request" ? (
//                                           <span
//                                             className={
//                                               styles.addendumIcon +
//                                               " " +
//                                               styles.changeRequest
//                                             }
//                                           >
//                                             🛠️{" "}
//                                           </span>
//                                         ) : item.addendum_type === "Renewal" ? (
//                                           <span
//                                             className={
//                                               styles.addendumIcon +
//                                               " " +
//                                               styles.renewal
//                                             }
//                                           >
//                                             ♻️{" "}
//                                           </span>
//                                         ) : (
//                                           ""
//                                         )}
//                                         {row.project_name || "N/A"}
//                                       </td>
//                                       <td>{formatDate(item.start_date)}</td>
//                                       <td>{formatDate(item.end_date)}</td>
//                                       <td>{item.delivery_unit || "N/A"}</td>
//                                       <td>{row.delivery_head || "N/A"}</td>
//                                       <td>{row.delivery_manager || "N/A"}</td>
//                                       <td>
//                                         <span
//                                           className={`${styles.status} ${
//                                             item.status?.toLowerCase() ===
//                                             "active"
//                                               ? styles.active
//                                               : item.status?.toLowerCase() ===
//                                                 "about-end"
//                                               ? styles.aboutEnd
//                                               : styles["in-active"]
//                                           }`}
//                                         >
//                                           {item.status || "Unknown"}
//                                         </span>
//                                       </td>
//                                       <td>
//                                         <span
//                                           role="button"
//                                           onClick={() =>
//                                             handleShowNotifications(row.sow_id)
//                                           }
//                                         >
//                                           🔔
//                                         </span>
//                                       </td>
//                                     </tr>
//                                   ))
//                                 ) : (
//                                   <tr>
//                                     <td colSpan="8">
//                                       No addendum data available
//                                     </td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="8">
//                   {searchTerm
//                     ? `No projects found matching "${searchTerm}"`
//                     : "No data available"}
//                 </td>
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
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             <button
//               className={styles.closeBtn}
//               onClick={() => setAddUserModalOpen(false)}
//             >
//               ✖
//             </button>
//             <AddNewUser onClose={() => setAddUserModalOpen(false)} />
//           </div>
//         </div>
//       )}

//       {isNotificationSlideoutOpen && (
//         <div className={styles.notificationSlideout}>
//           <div className={styles.notificationHeader}>
//             <h2>Notifications</h2>
//             <button
//               className={styles.closeBtn}
//               onClick={() => setNotificationSlideoutOpen(false)}
//             >
//               ✖
//             </button>
//           </div>
//           <div className={styles.notificationBody}>
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <div
//                   key={index}
//                   className={`${styles.notificationCard} ${
//                     styles[notification.type]
//                   }`}
//                 >
//                   <strong>{notification.title}</strong>
//                   <p>{notification.message}</p>
//                   <span className={styles.date}>
//                     {formatDate(notification.notification_date)}
//                   </span>
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
import EditSOWForm from "./EditSOWForm";
import NotificationSettings from "./NotificationSettings";
import styles from "./Dashboard.module.css";
import axios from "axios";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const Dashboard = () => {
  const [isSlideoutOpen, setSlideoutOpen] = useState(false);
  const [isHamburgerOpen, setHamburgerOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedSow, setSelectedSow] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [detailedData, setDetailedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [latestRenewalDates, setLatestRenewalDates] = useState({});
  const [userInfo, setUserInfo] = useState({
    name: "",
    role: "",
    email: "",
    avatar: "",
  });

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Edit SOW modal state
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editSowData, setEditSowData] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortData = (data) => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      if (sortField === "Start_date" || sortField === "end_date") {
        const dateA = aValue ? new Date(aValue).getTime() : 0;
        const dateB = bValue ? new Date(bValue).getTime() : 0;
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  };

  const fetchDashboardData = async (role) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      let endpoint = "";
      switch (role) {
        case "Admin":
          endpoint = "http://localhost:5000/api/dashboard";
          break;
        case "Delivery Head":
          endpoint = "http://localhost:5000/api/dashboard/delivery-head";
          break;
        case "Delivery Manager":
          endpoint = "http://localhost:5000/api/dashboard/delivery-manager";
          break;
        default:
          setError("Invalid user role. Please contact an administrator.");
          setLoading(false);
          return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboardData(response.data);

      if (response.data && response.data.length > 0) {
        const renewalDates = {};
        for (const row of response.data) {
          if (row.sow_id) {
            try {
              const addendumResponse = await axios.get(
                `http://localhost:5000/api/getAddendumsBySowId/${row.sow_id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const addendums = addendumResponse.data;
              let latestDate = null;
              for (const addendum of addendums) {
                if (addendum.addendum_type === "Renewal" && addendum.end_date) {
                  const endDate = new Date(addendum.end_date);
                  if (!latestDate || endDate > latestDate) {
                    latestDate = endDate;
                  }
                }
              }
              if (latestDate) {
                renewalDates[row.sow_id] = latestDate.toISOString();
              }
            } catch (err) {
              // ignore addendum fetch errors for now
            }
          }
        }
        setLatestRenewalDates(renewalDates);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/verify-token",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo({
        name: response.data.user.name,
        role: response.data.user.role,
        email: response.data.user.email,
      });
      await fetchDashboardData(response.data.user.role);
    } catch (err) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handleShowNotifications = async (sowId) => {
    setSelectedSow(sowId);
    setNotificationSlideoutOpen(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/notifications/${sowId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const notificationsWithType = response.data.map((n) => ({
        ...n,
        type:
          n.status === "Sent"
            ? "success"
            : n.status === "Pending"
            ? "warning"
            : "info",
      }));
      setNotifications(notificationsWithType);
    } catch (error) {
      setNotifications([]);
    }
  };

  const toggleAccordion = async (index, sowId) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/getAddendumsBySowId/${sowId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDetailedData(response.data);
      } catch (error) {
        setDetailedData([]);
      }
    }
  };

  // Edit SOW handler
  const handleEditSOW = (sowId) => {
    const sow = dashboardData.find((row) => row.sow_id === sowId);
    setEditSowData({ ...sow });
    setEditModalOpen(true);
  };

  const filteredDashboardData = dashboardData.filter((row) => {
    const searchFields = [
      row.project_name,
      row.Start_date,
      row.end_date,
      row.delivery_unit,
      row.delivery_head,
      row.delivery_manager,
      row.Status,
    ];
    return searchFields.some((field) =>
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedAndFilteredData = sortData(filteredDashboardData);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.error}>{error}</p>
        <button className={styles.retryButton} onClick={verifyToken}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div
          className={styles.hamburgerMenu}
          onClick={() => setHamburgerOpen(!isHamburgerOpen)}
        >
          ☰
        </div>
        <h1>SOW Information</h1>
        <div className={styles.userInfo}>
          <span className={styles.userRole}>{userInfo.role}</span>
          <span className={styles.userName}>{userInfo.name}</span>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionsButton}
            onClick={() => setSlideoutOpen(true)}
          >
            Upload Document
          </button>
        </div>
      </div>

      {isHamburgerOpen && (
        <div className={styles.hamburgerSlideout}>
          <div className={styles.hamburgerHeader}>
            <h2>Menu</h2>
            <button
              className={styles.closeBtn}
              onClick={() => setHamburgerOpen(false)}
            >
              ✖
            </button>
          </div>
          {/* <ul className={styles.menuOptions}>
            {(userInfo.role === "Admin" || userInfo.role === "Delivery Head") && (
              <li
                onClick={() => {
                  setAddUserModalOpen(true);
                  setHamburgerOpen(false);
                }}
              >
                👤 Add New User
              </li>
              
            )}
            <li onClick={handleLogout}>🚪 Logout</li>
          </ul> */}
          <ul className={styles.menuOptions}>
  {(userInfo.role === "Admin" || userInfo.role === "Delivery Head") && (
    <>
      <li
        onClick={() => {
          setAddUserModalOpen(true);
          setHamburgerOpen(false);
        }}
      >
        👤 Add New User
      </li>
     <li
  onClick={() => {
    setShowNotificationSettings(true);
    setHamburgerOpen(false);
  }}
>
  🛎️ Notification Settings
</li>
    </>
  )}
  <li onClick={handleLogout}>🚪 Logout</li>
</ul>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("project_name")}
                className={styles.sortableHeader}
              >
                Project Name
                {sortField === "project_name" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                onClick={() => handleSort("Start_date")}
                className={styles.sortableHeader}
              >
                Start Date
                {sortField === "Start_date" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                onClick={() => handleSort("end_date")}
                className={styles.sortableHeader}
              >
                End Date
                {sortField === "end_date" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                onClick={() => handleSort("delivery_unit")}
                className={styles.sortableHeader}
              >
                Delivery Unit
                {sortField === "delivery_unit" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                onClick={() => handleSort("delivery_head")}
                className={styles.sortableHeader}
              >
                Delivery Head
                {sortField === "delivery_head" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                onClick={() => handleSort("delivery_manager")}
                className={styles.sortableHeader}
              >
                Delivery Manager
                {sortField === "delivery_manager" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th
                onClick={() => handleSort("Status")}
                className={styles.sortableHeader}
              >
                Status
                {sortField === "Status" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.length > 0 ? (
              sortedAndFilteredData.map((row, index) => {
                const hasRenewalDate = latestRenewalDates[row.sow_id];
                const displayEndDate = hasRenewalDate
                  ? latestRenewalDates[row.sow_id]
                  : row.end_date;

                return (
                  <React.Fragment key={index}>
                    <tr className={styles.tableRow}>
                      <td className={styles.projectNameCell}>
                        <div className={styles.projectNameWrapper}>
                          <span
                            className={styles.expandIcon}
                            onClick={() => toggleAccordion(index, row.sow_id)}
                          >
                            {expandedRow === index ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                          <span>{row.project_name || "N/A"}</span>
                        </div>
                      </td>
                      <td>{formatDate(row.Start_date)}</td>
                      <td>
                        {formatDate(displayEndDate)}
                        {hasRenewalDate && (
                          <span
                            className={styles.renewalIndicator}
                            title="Updated from latest renewal"
                            style={{ marginLeft: "5px", color: "green" }}
                          >
                            .
                          </span>
                        )}
                      </td>
                      <td>{row.delivery_unit || "N/A"}</td>
                      <td>{row.delivery_head || "N/A"}</td>
                      <td>{row.delivery_manager || "N/A"}</td>
                      <td>
                        <span
                          className={`${styles.status} ${
                            row.Status?.toLowerCase() === "active"
                              ? styles.active
                              : row.Status?.toLowerCase() === "about-end"
                              ? styles.aboutEnd
                              : styles["in-active"]
                          }`}
                        >
                          {row.Status || "Unknown"}
                        </span>
                      </td>
                      <td>
                        <span
                          role="button"
                          onClick={() => handleShowNotifications(row.sow_id)}
                        >
                          🔔
                        </span>
                        <span
                          role="button"
                          onClick={() => handleEditSOW(row.sow_id)}
                          title="Edit SOW"
                          style={{ cursor: "pointer" }}
                        >
                          ✏️
                        </span>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan="8" className={styles.expandedContent}>
                          <div className={styles.expandedTable}>
                            <table>
                              <tbody>
                                {detailedData.length > 0 ? (
                                  detailedData.map((item, itemIndex) => (
                                    <tr key={itemIndex}>
                                      <td>
                                        {item.addendum_type ===
                                        "Change Request" ? (
                                          <span
                                            className={
                                              styles.addendumIcon +
                                              " " +
                                              styles.changeRequest
                                            }
                                          >
                                            🛠️{" "}
                                          </span>
                                        ) : item.addendum_type === "Renewal" ? (
                                          <span
                                            className={
                                              styles.addendumIcon +
                                              " " +
                                              styles.renewal
                                            }
                                          >
                                            ♻️{" "}
                                          </span>
                                        ) : (
                                          ""
                                        )}
                                        {row.project_name || "N/A"}
                                      </td>
                                      <td>{formatDate(item.start_date)}</td>
                                      <td>{formatDate(item.end_date)}</td>
                                      <td>{item.delivery_unit || "N/A"}</td>
                                      <td>{row.delivery_head || "N/A"}</td>
                                      <td>{row.delivery_manager || "N/A"}</td>
                                      <td>
                                        <span
                                          className={`${styles.status} ${
                                            item.status?.toLowerCase() ===
                                            "active"
                                              ? styles.active
                                              : item.status?.toLowerCase() ===
                                                "about-end"
                                              ? styles.aboutEnd
                                              : styles["in-active"]
                                          }`}
                                        >
                                          {item.status || "Unknown"}
                                        </span>
                                      </td>
                                      <td>
                                        <span
                                          role="button"
                                          onClick={() =>
                                            handleShowNotifications(row.sow_id)
                                          }
                                        >
                                          🔔
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="8">
                                      No addendum data available
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">
                  {searchTerm
                    ? `No projects found matching "${searchTerm}"`
                    : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isSlideoutOpen && (
        <div className={styles.slideoutPanel}>
          <UploadSOW onClose={() => setSlideoutOpen(false)} />
        </div>
      )}

      {isAddUserModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeBtn}
              onClick={() => setAddUserModalOpen(false)}
            >
              ✖
            </button>
            <AddNewUser onClose={() => setAddUserModalOpen(false)} />
          </div>
        </div>
      )}

      {isNotificationSlideoutOpen && (
        <div className={styles.notificationSlideout}>
          <div className={styles.notificationHeader}>
            <h2>Notifications</h2>
            <button
              className={styles.closeBtn}
              onClick={() => setNotificationSlideoutOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className={styles.notificationBody}>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`${styles.notificationCard} ${
                    styles[notification.type]
                  }`}
                >
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <span className={styles.date}>
                    {formatDate(notification.notification_date)}
                  </span>
                </div>
              ))
            ) : (
              <p>No notifications available.</p>
            )}
          </div>
        </div>
      )}

      {isEditModalOpen && editSowData && (
        <EditSOWForm
          sowData={editSowData}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => fetchDashboardData(userInfo.role)}
          userRole={userInfo.role}
        />
      )}
      {showNotificationSettings && (
  <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
)}
    </div>
  );
};

export default Dashboard;