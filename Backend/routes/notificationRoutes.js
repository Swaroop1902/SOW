const express = require("express");
const router = express.Router();
const { getNotificationsBySOW , updateAllNotificationDaysForAllSOWs } = require("../controllers/notificationController");

router.get("/notifications/:sowId", getNotificationsBySOW);

router.put("/notifications/updateAllDays", updateAllNotificationDaysForAllSOWs);

module.exports = router;
