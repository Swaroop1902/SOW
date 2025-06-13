"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./Portal.module.css"

const Portal = () => {
  const [activeTab, setActiveTab] = useState("frequents")
  const [searchTerm, setSearchTerm] = useState("")
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

  const handleAppClick = (app) => {
    if (app.route === "/gm-calculator") {
      // For now, show an alert since GM Calculator isn't implemented
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
          <img src="/logo.jpeg" alt="Company Logo" className={styles.logoImage} />
          <span className={styles.companyName}>Harbinger Group</span>
        </div>
        <div className={styles.userInfo}>
          <span className={styles.userInitials}>SB</span>
          <span className={styles.userName}>Swaroop</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "company" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("company")}
        >
          Intenal Applications
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

      {/* Footer */}
      <div className={styles.footer}>
        <p>© 2024 Harbinger Group. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Portal
