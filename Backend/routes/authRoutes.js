// const express = require("express");
// const router = express.Router();
// const { login } = require("../controllers/authController");
// const { resetPassword } = require("../controllers/authController");

// router.post("/login", login);
// router.post("/reset-password", resetPassword);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { login, resetPassword, verifyToken } = require("../controllers/authController");

router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/verify-token", verifyToken);

module.exports = router;
