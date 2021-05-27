const express = require("express");
const accountCtrl = require("../controllers/accountCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

// GET
router.get(
	"/:userId/:product_id/accounts/:account_id",
	auth.authenticate,
	accountCtrl.getSpecificAccount
);

// POST
router.post(
	"/:userId/:product_id/accounts",
	auth.authenticate,
	accountCtrl.addAccount
);

// UPDATE
router.patch(
	"/:userId/:product_id/accounts/:account_id",
	auth.authenticate,
	accountCtrl.updateAccount
);

// DELETE
router.delete(
	"/:userId/:product_id/accounts/:account_id",
	auth.authenticate,
	accountCtrl.deleteAccount
);

module.exports = router;
