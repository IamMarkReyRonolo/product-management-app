const express = require("express");
const customerCtrl = require("../controllers/customerCtrl");
const accountCtrl = require("../controllers/accountCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

// GET
router.get(
	"/:userId/customers",
	auth.authenticate,
	customerCtrl.getAllCustomers
);
router.get(
	"/:userId/customers/:customer_id",
	auth.authenticate,
	customerCtrl.getSpecificCustomer
);

// // POST
router.post(
	"/:userId/customers",
	auth.authenticate,
	customerCtrl.addIndirectCustomer
);
router.post(
	"/:userId/:account_id/customers/create",
	auth.authenticate,
	customerCtrl.addCustomer
);
router.post(
	"/:userId/:account_id/customers/:customer_id",
	auth.authenticate,
	accountCtrl.addExistingCustomer
);

// // UPDATE
router.patch(
	"/:userId/customers/:customer_id",
	auth.authenticate,
	customerCtrl.updateCustomer
);

// // DELETE
router.delete(
	"/:userId/customers/:customer_id",
	auth.authenticate,
	customerCtrl.deleteCustomer
);

module.exports = router;
