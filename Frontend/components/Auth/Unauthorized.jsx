"use client";
import { useRouter } from "next/navigation";
import styles from "./Unauthorized.module.css";

const Unauthorized = () => {
  const router = useRouter();

  const handleBackToLogin = () => {
    localStorage.removeItem("token"); // Clear any existing token
    router.push("/login");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <div className={styles.lockIcon}>🔒</div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Access Denied</h1>
          <p className={styles.message}>You don't have permission to access this Application.</p>
          <p className={styles.submessage}>This could be because:</p>
          <ul className={styles.reasonsList}>
            {/* <li>Your session has expired</li> */}
            <li>You don't have the required role permissions</li>
            <li>Your account access has been restricted</li>
          </ul>
        </div>
        
        <div className={styles.footer}>
          <p>Need help? Contact your system administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;