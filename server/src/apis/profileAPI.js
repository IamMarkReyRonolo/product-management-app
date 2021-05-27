const express = require("express");
const profileCtrl = require("../controllers/profileCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

// UPDATE
router.patch(
	"/:userId/:productId/:accountId/customers/:customer_id/profile",
	auth.authenticate,
	profileCtrl.updateProfile
);
router.delete(
	"/:userId/:productId/:accountId/customers/:customer_id/profile",
	auth.authenticate,
	profileCtrl.deleteProfile
);
module.exports = router;
