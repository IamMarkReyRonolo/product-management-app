const express = require("express");
const profileCtrl = require("../controllers/profileCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

// UPDATE
router.patch(
	"/customers/:customer_id/profile",
	auth.authenticate,
	profileCtrl.updateProfile
);
router.delete(
	"/customers/:customer_id/profile",
	auth.authenticate,
	profileCtrl.deleteProfile
);
module.exports = router;
