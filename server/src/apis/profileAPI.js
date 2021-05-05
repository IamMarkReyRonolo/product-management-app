const express = require("express");
const profileCtrl = require("../controllers/profileCtrl");
const router = express.Router();

// UPDATE
router.patch("/customers/:customer_id/profile", profileCtrl.updateProfile);

module.exports = router;
