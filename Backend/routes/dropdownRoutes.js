const express = require("express");
const router = express.Router();
const { getSOWDropdown } = require("../controllers/dropdownController");

// Route: GET /api/dropdown/sows
router.get("/sows", getSOWDropdown);

module.exports = router;
