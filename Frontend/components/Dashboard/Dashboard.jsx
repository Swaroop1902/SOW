// "use client"

// import React, { useState, useEffect } from "react"
// import UploadSOW from "./UploadSOW"
// import AddNewUser from "./AddNewUser"
// import styles from "./Dashboard.module.css"
// import axios from "axios"
// import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"

// const handleLogout = () => {
//   localStorage.removeItem("token")
//   window.location.href = "/login"
// }

// const Dashboard = () => {
//   const [isSlideoutOpen, setSlideoutOpen] = useState(false)
//   const [isHamburgerOpen, setHamburgerOpen] = useState(false)
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false)
//   const [dashboardData, setDashboardData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] = useState(false)
//   const [notifications, setNotifications] = useState([])
//   const [selectedSow, setSelectedSow] = useState(null)
//   const [expandedRow, setExpandedRow] = useState(null)
//   const [detailedData, setDetailedData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const itemsPerPage = 5
//   const [searchTerm, setSearchTerm] = useState("")
//   const [userInfo, setUserInfo] = useState({
//     name: "John Doe",
//     role: "Admin",
//     email: "john.doe@example.com",
//     avatar: "/placeholder.svg?height=40&width=40",
//   })

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A"
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     }).format(date)
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/dashboard")
//         const data = await response.json()
//         setDashboardData(data)
//         setLoading(false)
//       } catch (err) {
//         console.error("Error fetching data:", err)
//         setError("Failed to load dashboard data. Please try again later.")
//         setLoading(false)
//       }
//     }
//     fetchData()
//   }, [])

//   const handleShowNotifications = async (sowId) => {
//     setSelectedSow(sowId)
//     setNotificationSlideoutOpen(true)

//     try {
//       const response = await axios.get(`http://localhost:5000/api/notifications/${sowId}`)
//       setNotifications(response.data)
//     } catch (error) {
//       console.error("Error fetching notifications:", error)
//       setNotifications([])
//     }
//   }

//   const toggleAccordion = async (index, sowId) => {
//     if (expandedRow === index) {
//       setExpandedRow(null)
//     } else {
//       setExpandedRow(index)
//       setCurrentPage(1)

//       try {
//         const response = await axios.get(`http://localhost:5000/api/getAddendumsBySowId/${sowId}`)
//         setDetailedData(response.data)
//       } catch (error) {
//         console.error("Error fetching addendum data:", error)
//         setDetailedData([])
//       }
//     }
//   }

//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentItems = detailedData.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(detailedData.length / itemsPerPage)

//   const paginate = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber)
//     }
//   }

//   const filteredDashboardData = dashboardData.filter((row) =>
//     row.project_name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   if (loading) return <p>Loading...</p>
//   if (error) return <p className="error">{error}</p>

//   return (
//     <div className={styles.dashboardContainer}>
//       <div className={styles.header}>
//         <div className={styles.hamburgerMenu} onClick={() => setHamburgerOpen(!isHamburgerOpen)}>
//           ☰
//         </div>
//         <h1>SOW Information</h1>
//         <div className={styles.searchContainer}>
//           <input
//             type="text"
//             placeholder="Search project name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className={styles.searchInput}
//           />
//         </div>
//         <div className={styles.actions}>
//           <button className={styles.actionsButton} onClick={() => setSlideoutOpen(true)}>
//             Upload Document
//           </button>
//         </div>
//       </div>

//       {isHamburgerOpen && (
//         <div className={styles.hamburgerSlideout}>
//           <div className={styles.hamburgerHeader}>
//             <h2>Menu</h2>
//             <button className={styles.closeBtn} onClick={() => setHamburgerOpen(false)}>
//               ✖
//             </button>
//           </div>
//           <ul className={styles.menuOptions}>
//             <li
//               onClick={() => {
//                 setAddUserModalOpen(true)
//                 setHamburgerOpen(false)
//               }}
//             >
//               👤 Add New User
//             </li>
//             <li onClick={handleLogout}>🚪 Logout</li>
//           </ul>
//         </div>
//       )}

//       <div className={styles.tableContainer}>
//         <table className={styles.table}>
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
//             {filteredDashboardData.length > 0 ? (
//               filteredDashboardData.map((row, index) => (
//                 <React.Fragment key={index}>
//                   <tr className={styles.tableRow}>
//                     <td className={styles.projectNameCell}>
//                       <div className={styles.projectNameWrapper}>
//                         <span className={styles.expandIcon} onClick={() => toggleAccordion(index, row.sow_id)}>
//                           {expandedRow === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                         </span>
//                         <span>{row.project_name || "N/A"}</span>
//                       </div>
//                     </td>
//                     <td>{formatDate(row.Start_date)}</td>
//                     <td>{formatDate(row.end_date)}</td>
//                     <td>{row.delivery_unit || "N/A"}</td>
//                     <td>{row.delivery_head || "N/A"}</td>
//                     <td>{row.delivery_manager || "N/A"}</td>
//                     <td>
//                       <span
//                         className={`${styles.status} ${
//                           row.Status?.toLowerCase() === "active" ? styles.active : 
//                           row.Status?.toLowerCase() === "about-end" ? styles.aboutEnd : 
//                           styles["in-active"]
//                         }`}
//                       >
//                         {row.Status || "Unknown"}
//                       </span>
//                     </td>
//                     <td>
//                       <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
//                         🔔
//                       </span>
//                     </td>
//                   </tr>
//                   {expandedRow === index && (
//                     <tr>
//                       <td colSpan="8" className={styles.expandedContent}>
//                         <div className={styles.expandedTable}>
//                           <table>
//                             <tbody>
//                               {currentItems.length > 0 ? (
//                                 currentItems.map((item, itemIndex) => (
//                                   <tr key={itemIndex}>
//                                     <td>{row.project_name || "N/A"}</td>
//                                     <td>{formatDate(item.start_date)}</td>
//                                     <td>{formatDate(item.end_date)}</td>
//                                     <td>{item.delivery_unit || "N/A"}</td>
//                                     <td>{row.delivery_head || "N/A"}</td>
//                                     <td>{item.delivery_manager || row.delivery_manager || "N/A"}</td>
//                                     <td>
//                                       <span
//                                         className={`${styles.status} ${
//                                           row.Status?.toLowerCase() === "active" ? styles.active : 
//                                           row.Status?.toLowerCase() === "about-end" ? styles.aboutEnd : 
//                                           styles["in-active"]
//                                         }`}
//                                       >
//                                         {row.Status || "Unknown"}
//                                       </span>
//                                     </td>
//                                     <td>
//                                       <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
//                                         🔔
//                                       </span>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr>
//                                   <td colSpan="8">No addendum data available</td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                           {detailedData.length > itemsPerPage && (
//                             <div className={styles.pagination}>
//                               <button
//                                 onClick={() => paginate(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className={styles.paginationButton}
//                               >
//                                 <ChevronLeft size={16} />
//                               </button>
//                               <span className={styles.pageInfo}>
//                                 Page {currentPage} of {totalPages}
//                               </span>
//                               <button
//                                 onClick={() => paginate(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                                 className={styles.paginationButton}
//                               >
//                                 <ChevronRight size={16} />
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8">{searchTerm ? `No projects found matching "${searchTerm}"` : "No data available"}</td>
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
//             <button className={styles.closeBtn} onClick={() => setAddUserModalOpen(false)}>
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
//             <button className={styles.closeBtn} onClick={() => setNotificationSlideoutOpen(false)}>
//               ✖
//             </button>
//           </div>
//           <div className={styles.notificationBody}>
//             {notifications.length > 0 ? (
//               notifications.map((notification, index) => (
//                 <div key={index} className={`${styles.notificationCard} ${styles[notification.type]}`}>
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
//   )
// }

// export default Dashboard
"use client"

import React, { useState, useEffect } from "react"
import UploadSOW from "./UploadSOW"
import AddNewUser from "./AddNewUser"
import styles from "./Dashboard.module.css"
import axios from "axios"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"

const handleLogout = () => {
  localStorage.removeItem("token")
  window.location.href = "/login"
}

const Dashboard = () => {
  const [isSlideoutOpen, setSlideoutOpen] = useState(false)
  const [isHamburgerOpen, setHamburgerOpen] = useState(false)
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isNotificationSlideoutOpen, setNotificationSlideoutOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [selectedSow, setSelectedSow] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)
  const [detailedData, setDetailedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [searchTerm, setSearchTerm] = useState("")
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    role: "Admin",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
  })

  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date)
  }

  const handleSort = (field) => {
    // If clicking the same field, toggle direction
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // New field, set to ascending by default
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortData = (data) => {
    if (!sortField) return data

    return [...data].sort((a, b) => {
      // Handle null or undefined values
      const aValue = a[sortField] || ""
      const bValue = b[sortField] || ""

      // Handle date fields
      if (sortField === "Start_date" || sortField === "end_date") {
        const dateA = aValue ? new Date(aValue).getTime() : 0
        const dateB = bValue ? new Date(bValue).getTime() : 0

        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }

      // Handle string fields
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      // Handle numeric fields
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard")
        const data = await response.json()
        setDashboardData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleShowNotifications = async (sowId) => {
    setSelectedSow(sowId)
    setNotificationSlideoutOpen(true)

    try {
      const response = await axios.get(`http://localhost:5000/api/notifications/${sowId}`)
      setNotifications(response.data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
    }
  }

  const toggleAccordion = async (index, sowId) => {
    if (expandedRow === index) {
      setExpandedRow(null)
    } else {
      setExpandedRow(index)
      setCurrentPage(1)

      try {
        const response = await axios.get(`http://localhost:5000/api/getAddendumsBySowId/${sowId}`)
        setDetailedData(response.data)
      } catch (error) {
        console.error("Error fetching addendum data:", error)
        setDetailedData([])
      }
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = detailedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(detailedData.length / itemsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const filteredDashboardData = dashboardData.filter((row) => {
    const searchFields = [
      row.project_name,
      row.Start_date,
      row.end_date,
      row.delivery_unit,
      row.delivery_head,
      row.delivery_manager,
      row.Status,
    ]

    return searchFields.some((field) => field?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const sortedAndFilteredData = sortData(filteredDashboardData)

  if (loading) return <p>Loading...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <div className={styles.hamburgerMenu} onClick={() => setHamburgerOpen(!isHamburgerOpen)}>
          ☰
        </div>
        <h1>SOW Information</h1>
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
          <button className={styles.actionsButton} onClick={() => setSlideoutOpen(true)}>
            Upload Document
          </button>
        </div>
      </div>

      {isHamburgerOpen && (
        <div className={styles.hamburgerSlideout}>
          <div className={styles.hamburgerHeader}>
            <h2>Menu</h2>
            <button className={styles.closeBtn} onClick={() => setHamburgerOpen(false)}>
              ✖
            </button>
          </div>
          <ul className={styles.menuOptions}>
            <li
              onClick={() => {
                setAddUserModalOpen(true)
                setHamburgerOpen(false)
              }}
            >
              👤 Add New User
            </li>
            <li onClick={handleLogout}>🚪 Logout</li>
          </ul>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("project_name")} className={styles.sortableHeader}>
                Project Name
                {sortField === "project_name" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("Start_date")} className={styles.sortableHeader}>
                Start Date
                {sortField === "Start_date" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("end_date")} className={styles.sortableHeader}>
                End Date
                {sortField === "end_date" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("delivery_unit")} className={styles.sortableHeader}>
                Delivery Unit
                {sortField === "delivery_unit" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("delivery_head")} className={styles.sortableHeader}>
                Delivery Head
                {sortField === "delivery_head" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("delivery_manager")} className={styles.sortableHeader}>
                Delivery Manager
                {sortField === "delivery_manager" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th onClick={() => handleSort("Status")} className={styles.sortableHeader}>
                Status
                {sortField === "Status" && (
                  <span className={styles.sortIndicator}>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
              <th>Notifications</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredData.length > 0 ? (
              sortedAndFilteredData.map((row, index) => (
                <React.Fragment key={index}>
                  <tr className={styles.tableRow}>
                    <td className={styles.projectNameCell}>
                      <div className={styles.projectNameWrapper}>
                        <span className={styles.expandIcon} onClick={() => toggleAccordion(index, row.sow_id)}>
                          {expandedRow === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                        <span>{row.project_name || "N/A"}</span>
                      </div>
                    </td>
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
                            : row.Status?.toLowerCase() === "about-end"
                              ? styles.aboutEnd
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
                  {expandedRow === index && (
                    <tr>
                      <td colSpan="8" className={styles.expandedContent}>
                        <div className={styles.expandedTable}>
                          <table>
                            <tbody>
                              {currentItems.length > 0 ? (
                                currentItems.map((item, itemIndex) => (
                                  <tr key={itemIndex}>
                                    <td>{row.project_name || "N/A"}</td>
                                    <td>{formatDate(item.start_date)}</td>
                                    <td>{formatDate(item.end_date)}</td>
                                    <td>{item.delivery_unit || "N/A"}</td>
                                    <td>{row.delivery_head || "N/A"}</td>
                                    <td>{row.delivery_manager || row.delivery_manager || "N/A"}</td>
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
                                      <span role="button" onClick={() => handleShowNotifications(row.sow_id)}>
                                        🔔
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="8">No addendum data available</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {detailedData.length > itemsPerPage && (
                            <div className={styles.pagination}>
                              <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={styles.paginationButton}
                              >
                                <ChevronLeft size={16} />
                              </button>
                              <span className={styles.pageInfo}>
                                Page {currentPage} of {totalPages}
                              </span>
                              <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={styles.paginationButton}
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="8">{searchTerm ? `No projects found matching "${searchTerm}"` : "No data available"}</td>
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
            <button className={styles.closeBtn} onClick={() => setAddUserModalOpen(false)}>
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
            <button className={styles.closeBtn} onClick={() => setNotificationSlideoutOpen(false)}>
              ✖
            </button>
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
  )
}

export default Dashboard
