const express = require("express");
const customerCtrl = require("../controllers/customerCtrl");
const accountCtrl = require("../controllers/accountCtrl");
const router = express.Router();

// GET
router.get("/customers", customerCtrl.getAllCustomers);
router.get("/customers/:customer_id", customerCtrl.getSpecificCustomer);

// // POST
router.post("/customers/create", customerCtrl.addIndirectCustomer);
router.post("/:account_id/customers/create", customerCtrl.addCustomer);
router.post(
	"/:account_id/customers/:customer_id",
	accountCtrl.addExistingCustomer
);

// // UPDATE
router.patch("/customers/:customer_id", customerCtrl.updateCustomer);

// // DELETE
router.delete("/customers/:customer_id", customerCtrl.deleteCustomer);

module.exports = router;
