// // "use client"
// // import { useEffect, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import styles from "./Portal.module.css"

// // const Portal = () => {
// //   const [activeTab, setActiveTab] = useState("frequents")
// //   const [searchTerm, setSearchTerm] = useState("")
// //   const [userEmail, setUserEmail] = useState("")
// //   const router = useRouter()

// //   const applications = [
// //     {
// //       id: "sow-tracker",
// //       name: "SOW Tracker",
// //       description: "Manage your SOW documents",
// //       icon: "📋",
// //       color: "#2c3e50",
// //       route: "/login",
// //     },
// //     {
// //       id: "gm-calculator",
// //       name: "GM Calculator",
// //       description: "Calculate gross margins",
// //       icon: "🧮",
// //       color: "#27ae60",
// //       route: "/gm-calculator", // This would be implemented later
// //     },
// //   ]

// //   useEffect(() => {
// //     const email = localStorage.getItem("userEmail")
// //     setUserEmail(email || "")
// //   }, [])

// //   const handleLogout = () => {
// //     localStorage.removeItem("token")
// //     localStorage.removeItem("userEmail")
// //     localStorage.removeItem("userName")
// //     router.push("/login")
// //   }

// //   const handleAppClick = (app) => {
// //     if (app.route === "/gm-calculator") {
// //       // For now, show an alert since GM Calculator isn't implemented
// //       alert("GM Calculator will be available soon!")
// //       return
// //     }
// //     router.push(app.route)
// //   }

// //   const filteredApps = applications.filter(
// //     (app) =>
// //       app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       app.description.toLowerCase().includes(searchTerm.toLowerCase()),
// //   )

// //   return (
// //     <div className={styles.portalContainer}>
// //       {/* Header */}
// //       <div className={styles.header}>
// //         <div className={styles.logo}>
// //           {/* <img src="/logo.jpeg" alt="Company Logo" className={styles.logoImage} /> */}
// //           <span className={styles.companyName}>Harbinger Group</span>
// //         </div>
// //         <div className={styles.userInfo}>
// //           {userEmail && (
// //             <span className={styles.userEmail}>{userEmail}</span>
// //           )}
// //           <button className={styles.logoutBtn} onClick={handleLogout}>
// //             Logout
// //           </button>
// //         </div>
// //       </div>

// //       {/* Navigation Tabs */}
// //       <div className={styles.tabContainer}>
// //         <button
// //           className={`${styles.tab} ${activeTab === "company" ? styles.activeTab : ""}`}
// //           onClick={() => setActiveTab("company")}
// //         >
// //           Internal Applications
// //         </button>
// //       </div>

// //       {/* Applications Grid */}
// //       <div className={styles.appsContainer}>
// //         <div className={styles.appsGrid}>
// //           {filteredApps.map((app) => (
// //             <div key={app.id} className={styles.appCard} onClick={() => handleAppClick(app)}>
// //               <div className={styles.appIcon} style={{ backgroundColor: app.color }}>
// //                 <span className={styles.iconText}>{app.icon}</span>
// //               </div>
// //               <div className={styles.appInfo}>
// //                 <h3 className={styles.appName}>{app.name}</h3>
// //                 <p className={styles.appDescription}>{app.description}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {filteredApps.length === 0 && (
// //           <div className={styles.noResults}>
// //             <p>No applications found matching "{searchTerm}"</p>
// //           </div>
// //         )}
// //       </div>

// //       {/* Footer */}
// //       <div className={styles.footer}>
// //         <p>© 2024 Harbinger Group. All rights reserved.</p>
// //       </div>
// //     </div>
// //   )
// // }

// // export default Portal
// "use client"
// import React, { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import styles from "./Portal.module.css"

// const Portal = () => {
//   const [activeTab, setActiveTab] = useState("frequents")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [userEmail, setUserEmail] = useState("")
//   const [error, setError] = useState("")
//   const router = useRouter()

//   const applications = [
//     {
//       id: "sow-tracker",
//       name: "SOW Tracker",
//       description: "Manage your SOW documents",
//       icon: "📋",
//       color: "#2c3e50",
//       route: "/login",
//     },
//     {
//       id: "gm-calculator",
//       name: "GM Calculator",
//       description: "Calculate gross margins",
//       icon: "🧮",
//       color: "#27ae60",
//       route: "/gm-calculator", // This would be implemented later
//     },
//   ]

//   useEffect(() => {
//     const email = localStorage.getItem("userEmail")
//     if (email) setUserEmail(email)
//   }, [])

//   const handleSOWTrackerClick = async () => {
//     setError("")
//     try {
//       const response = await fetch("http://localhost:5000/api/sowlogin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: userEmail }), // Send email as body
//       })
//       const data = await response.json()
//       console.log("SOW Tracker response:", data)
//       // if (data.success) {
//       //   // Optionally store user info
//       //   localStorage.setItem("userEmail", data.userInfo.email)
//       //   localStorage.setItem("userName", data.userInfo.name)
//       //   // Redirect to dashboard
//       //   router.push("/dashboard")
//       // } else {
//       //   setError(data.message || "Not authorised")
//       // }
//       if (data.success) {
//   localStorage.setItem('userEmail', data.userInfo.email);
//   localStorage.setItem('userName', data.userInfo.name);
//   if (data.token) {
//     localStorage.setItem('token', data.token); // Store the JWT token
//   }
//   router.push('/dashboard');
// } else {
//   setError(data.message || 'Not authorised');
// }
//     } catch (err) {
//       setError("Server error")
//     }
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     localStorage.removeItem("userEmail")
//     localStorage.removeItem("userName")
//     router.push("/login")
//   }

//   const handleAppClick = (app) => {
//     if (app.route === "/gm-calculator") {
//       // For now, show an alert since GM Calculator isn't implemented
//       alert("GM Calculator will be available soon!")
//       return
//     }
//     router.push(app.route)
//   }

//   const filteredApps = applications.filter(
//     (app) =>
//       app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.description.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   return (
//     <div className={styles.portalContainer}>
//       {/* Header */}
//       <div className={styles.header}>
//         <div className={styles.logo}>
//           {/* <img src="/logo.jpeg" alt="Company Logo" className={styles.logoImage} /> */}
//           <span className={styles.companyName}>Harbinger Group</span>
//         </div>
//         <div className={styles.userInfo}>
//           {userEmail && (
//             <span className={styles.userEmail}>{userEmail}</span>
//           )}
//           <button className={styles.logoutBtn} onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className={styles.tabContainer}>
//         <button
//           className={`${styles.tab} ${activeTab === "company" ? styles.activeTab : ""}`}
//           onClick={() => setActiveTab("company")}
//         >
//           Internal Applications
//         </button>
//       </div>

//       {/* Applications Grid */}
//       <div className={styles.appsContainer}>
//         <div className={styles.appsGrid}>
//           {filteredApps.map((app) => (
//             <div key={app.id} className={styles.appCard} onClick={() => handleAppClick(app)}>
//               <div className={styles.appIcon} style={{ backgroundColor: app.color }}>
//                 <span className={styles.iconText}>{app.icon}</span>
//               </div>
//               <div className={styles.appInfo}>
//                 <h3 className={styles.appName}>{app.name}</h3>
//                 <p className={styles.appDescription}>{app.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredApps.length === 0 && (
//           <div className={styles.noResults}>
//             <p>No applications found matching "{searchTerm}"</p>
//           </div>
//         )}
//       </div>

//       {/* SOW Tracker Button */}
//       <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
//         <button onClick={handleSOWTrackerClick} className={styles.sowTrackerBtn}>
//           SOW Tracker
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

//       {/* Footer */}
//       <div className={styles.footer}>
//         <p>© 2024 Harbinger Group. All rights reserved.</p>
//       </div>
//     </div>
//   )
// }

// export default Portal
"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./Portal.module.css"

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Portal = () => {
  const [activeTab, setActiveTab] = useState("frequents")
  const [searchTerm, setSearchTerm] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const applications = [
    {
      id: "sow-tracker",
      name: "SOW Tracker",
      description: "Manage your SOW documents",
      icon: "📋",
      color: "#2c3e50",
      route: "/login",
    },
    {
      id: "gm-calculator",
      name: "GM Calculator",
      description: "Calculate gross margins",
      icon: "🧮",
      color: "#27ae60",
      route: "/gm-calculator", // This would be implemented later
    },
  ]

  // useEffect(() => {
  //   const email = localStorage.getItem("userEmail")
  //   if (email) setUserEmail(email)
  // }, [])


  useEffect(() => {
  const email = localStorage.getItem("userEmail");
  if (email) {
    setUserEmail(email);
  } else {
    router.push("/login");
  }
}, []);

  const handleSOWTrackerClick = async () => {
    setError("")
    try {
      const response = await fetch(`${API_URL}/api/sowlogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem('userEmail', data.userInfo.email)
        localStorage.setItem('userName', data.userInfo.name)
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        router.push('/dashboard')
      } else {
        // setError(data.message || 'Not authorised')
        router.push('/unauthorized')
      }
    } catch (err) {
      setError("Server error")
      router.push('/unauthorized')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  // Updated: SOW Tracker app uses handleSOWTrackerClick, others use default
  const handleAppClick = (app) => {
    if (app.id === "sow-tracker") {
      handleSOWTrackerClick()
      return
    }
    if (app.route === "/gm-calculator") {
      alert("GM Calculator will be available soon!")
      return
    }
    router.push(app.route)
  }

  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={styles.portalContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>
          {/* <img src="/logo.jpeg" alt="Company Logo" className={styles.logoImage} /> */}
          <span className={styles.companyName}>Harbinger Group</span>
        </div>
        <div className={styles.userInfo}>
          {userEmail && (
            <span className={styles.userEmail}>{userEmail}</span>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "company" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("company")}
        >
          Internal Applications
        </button>
      </div>

      {/* Applications Grid */}
      <div className={styles.appsContainer}>
        <div className={styles.appsGrid}>
          {filteredApps.map((app) => (
            <div key={app.id} className={styles.appCard} onClick={() => handleAppClick(app)}>
              <div className={styles.appIcon} style={{ backgroundColor: app.color }}>
                <span className={styles.iconText}>{app.icon}</span>
              </div>
              <div className={styles.appInfo}>
                <h3 className={styles.appName}>{app.name}</h3>
                <p className={styles.appDescription}>{app.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className={styles.noResults}>
            <p>No applications found matching "{searchTerm}"</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

      {/* Footer */}
      <div className={styles.footer}>
        <p>© 2024 Harbinger Group. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Portal