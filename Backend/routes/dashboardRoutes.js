const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
// const verifyToken = require("../"); // Middleware to decode JWT and attach req.user
const verifyToken = require("../middleware/authMiddleware").authenticate; // Middleware to decode JWT and attach req.user
// Role-based dashboard routes, protected by JWT
router.get("/dashboard", verifyToken, dashboardController.getDashboardForAdmin);
router.get("/dashboard/delivery-manager", verifyToken, dashboardController.getDashboardForDeliveryManager);
router.get("/dashboard/delivery-head", verifyToken, dashboardController.getDashboardForDeliveryHead);

module.exports = router;
