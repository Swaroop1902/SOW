const express = require("express");
const router = express.Router();
const { getSOWDropdown,getFullSOWDetails } = require("../controllers/dropdownController");

// Route: GET /api/dropdown/sows
router.get("/sows", getSOWDropdown);
router.get("/GetFullSowDetails/:id", getFullSOWDetails);
module.exports = router;
