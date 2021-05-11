const express = require("express");
const logCtrl = require("../controllers/logCtrl");
const router = express();

router.post("/:accounting_id/logs");

module.exports = router;
