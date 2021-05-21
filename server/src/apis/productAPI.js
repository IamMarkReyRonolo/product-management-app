const express = require("express");
const productCtrl = require("../controllers/productCtrl");
const router = express.Router();
const auth = require("../controllers/auth");

const multer = require("multer");
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "src/uploads");
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	},
});

const fileFilter = (req, file, callback, next) => {
	if (file.mimetype === "image/jpeg" || file.mimetype == "image/png") {
		callback(null, true);
	} else {
		const error = new Error("Error saving file. File must be of type png/jpeg");
		error.status = 500;
		callback(error, false);
	}
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

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
	upload.single("product_image"),
	productCtrl.addProduct
);

// UPDATE
router.patch(
	"/:userId/products/:id",
	auth.authenticate,
	upload.single("product_image"),
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
