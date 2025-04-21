const express = require("express");
const router = express.Router();
const { getNotificationsBySOW } = require("../controllers/notificationController");

router.get("/notifications/:sowId", getNotificationsBySOW);

module.exports = router;
