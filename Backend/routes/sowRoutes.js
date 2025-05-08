const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadSOW, getDashboard , getDeliveryManagers , uploadAddendum , getAddendumsBySowId} = require("../controllers/sowController");

router.post("/upload", upload.single("pdf"), uploadSOW);
// router.get("/dashboard", getDashboard);
router.get('/DeliveryManager', getDeliveryManagers);
// router.post("/uploadAddendum", upload.single("pdf"), uploadAddendum);
router.post("/uploadAddendum", upload.single("pdf"), uploadAddendum);
router.get("/getAddendumsBySowId/:sowId", getAddendumsBySowId);

module.exports = router;
