const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const router = express.Router();

// UPDATE
router.post("/login", userCtrl.logIn);
router.post("/signup", userCtrl.signUp);
module.exports = router;
