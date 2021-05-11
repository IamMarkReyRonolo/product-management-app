const express = require("express");
const accountingCtrl = require("../controllers/accountingCtrl");
const router = express.Router();

router.get("/:product_id/accounting", accountingCtrl.getAccounting);
router.patch("/:product_id/accounting");

module.exports = router;
