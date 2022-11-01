const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");

router.post("/signup",authController.register);

router.post("/login", authController.login);

router.post("/mailsend", authController.sendMails);

router.post("/forgotpassword", authController.forgotpassword);

module.exports = router;
