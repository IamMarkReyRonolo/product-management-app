const express = require("express");
const accountingCtrl = require("../controllers/accountingCtrl");
const router = express.Router();

router.get("/:product_id/accounting", accountingCtrl.getAccounting);

module.exports = router;
