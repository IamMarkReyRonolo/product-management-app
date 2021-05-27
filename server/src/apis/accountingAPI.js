const express = require("express");
const accountingCtrl = require("../controllers/accountingCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

router.get(
	"/:userId/:product_id/accounting",
	auth.authenticate,
	accountingCtrl.getAccounting
);

module.exports = router;
