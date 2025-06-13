
const express = require("express");
const router = express.Router();
const { login, resetPassword, verifyToken, sowlogin } = require("../controllers/authController");

router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/verify-token", verifyToken);
router.post("/sowlogin", sowlogin);

module.exports = router;
