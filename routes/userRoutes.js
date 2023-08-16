const express = require("express");
const router = express.Router();
const { registerUser, loginUser, adminUser} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/admin").get(validateToken, adminUser);

module.exports = router;