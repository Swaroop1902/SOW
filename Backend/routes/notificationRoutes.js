const express = require("express");
const router = express.Router();
const { getNotificationsBySOW , updateNotificationNumberForAllSOWs } = require("../controllers/notificationController");

router.get("/notifications/:sowId", getNotificationsBySOW);

router.put("/notifications/update", updateNotificationNumberForAllSOWs);

module.exports = router;
