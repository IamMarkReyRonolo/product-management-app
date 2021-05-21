const express = require("express");
const userCtrl = require("../controllers/userCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

// UPDATE
router.get("/user", auth.authenticate, userCtrl.getUser);
router.post("/login", userCtrl.logIn);
router.post("/signup", userCtrl.signUp);

module.exports = router;
