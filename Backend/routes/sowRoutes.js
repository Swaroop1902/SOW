const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadSOW, getDashboard , getDeliveryManagers } = require("../controllers/sowController");

router.post("/upload", upload.single("pdf"), uploadSOW);
router.get("/dashboard", getDashboard);
router.get('/DeliveryManager', getDeliveryManagers);

module.exports = router;
