const express = require("express");
const productCtrl = require("../controllers/productCtrl");
const router = express.Router();

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
router.get("/", productCtrl.getAllProducts);
router.get("/:id", productCtrl.getSpecificProduct);

// POST
router.post("/", upload.single("product_image"), productCtrl.addProduct);

// UPDATE
router.patch("/:id", upload.single("product_image"), productCtrl.updateProduct);

// DELETE
router.delete("/:id", productCtrl.deleteProduct);
router.delete("/", productCtrl.deleteAllProduct);

module.exports = router;
