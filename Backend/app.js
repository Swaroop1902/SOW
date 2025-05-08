require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");


const authRoutes = require("./routes/authRoutes");
const sowRoutes = require("./routes/sowRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dropdownRoutes = require("./routes/dropdownRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const { sendNotifications } = require("./controllers/notificationController");
const { updateSOWStatus } = require('./controllers/sowStatusController'); // For updating SOW status

// require("./cron/scheduler");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api", sowRoutes);
app.use("/api", userRoutes);
app.use("/api", notificationRoutes);
app.use("/api", dropdownRoutes);
app.use("/api", dashboardRoutes);




// sendNotifications();

//Cron for triggering notifications at 9 AM every day
cron.schedule("0 9 * * *", () => {
  sendNotifications();
  console.log("Scheduled notification sent at 9 AM");
});


// updateSOWStatus(); // Call the function to update SOW status immediately on server start

cron.schedule("0 9 * * *", () => {
  updateSOWStatus();
  console.log("Scheduled notification sent at 9 AM");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
