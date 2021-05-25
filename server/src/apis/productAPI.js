const express = require("express");
const productCtrl = require("../controllers/productCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

// GET
router.get("/:userId/products", auth.authenticate, productCtrl.getAllProducts);
router.get(
	"/:userId/products/:id",
	auth.authenticate,
	productCtrl.getSpecificProduct
);

// POST
router.post(
	"/:userId/products",
	auth.authenticate,

	productCtrl.addProduct
);

// UPDATE
router.patch(
	"/:userId/products/:id",
	auth.authenticate,

	productCtrl.updateProduct
);

// DELETE
router.delete(
	"/:userId/products/:id",
	auth.authenticate,
	productCtrl.deleteProduct
);
router.delete("/", auth.authenticate, productCtrl.deleteAllProduct);

module.exports = router;
