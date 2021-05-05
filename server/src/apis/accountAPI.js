const express = require("express");
const accountCtrl = require("../controllers/accountCtrl");
const router = express.Router();

// GET
router.get("/:product_id/accounts/:account_id", accountCtrl.getSpecificAccount);

// POST
router.post("/:product_id/accounts", accountCtrl.addAccount);

// UPDATE
router.patch("/:product_id/accounts/:account_id", accountCtrl.updateAccount);

// DELETE
router.delete("/:product_id/accounts/:account_id", accountCtrl.deleteAccount);

module.exports = router;
