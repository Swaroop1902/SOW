const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { resetPassword } = require("../controllers/authController");

router.post("/login", login);
router.post("/reset-password", resetPassword);

module.exports = router;
