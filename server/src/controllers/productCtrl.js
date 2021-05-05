const model = require("../models");

const getAllProducts = (req, res, next) => {
	model.Product.findAll()
		.then((result) => {
			if (!result) {
				const error = new Error("Product not found");
				error.status = 404;
				next(error);
			}
			res.status(200).json({ count: result.length, data: { result } });
		})
		.catch((err) => {
			next(err);
		});
};

const getSpecificProduct = async (req, res, next) => {
	try {
		const prod = await model.Product.findByPk(req.params.id);
		if (!prod) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
		const account = await prod.getAccounts();
		res.status(200).json({
			product: prod,
			accounts: account,
		});
	} catch (error) {
		next(error);
	}
};

const addProduct = (req, res, next) => {
	console.log(req.file);
	model.Product.create({
		product_name: req.body.product_name,
		product_image: req.file.path,
	})
		.then((result) => {
			res
				.status(201)
				.json({ message: "Successfully created product", product: result });
		})
		.catch((err) => {
			next(err);
		});
};

const updateProduct = (req, res, next) => {
	model.Product.update(
		{ product_name: req.body.product_name, product_image: req.file.path },
		{ where: { id: req.params.id } }
	)
		.then((result) => {
			console.log(result);
			if (!result) {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}

			res.status(200).json({ message: "Successfully updated product" });
		})
		.catch((err) => {
			next(err);
		});
};

const deleteProduct = async (req, res, next) => {
	try {
		const data = await model.Product.findByPk(req.params.id, {
			attributes: ["product_image"],
		});

		model.Product.destroy({ where: { id: req.params.id } })
			.then((result) => {
				if (!result) {
					const error = new Error("Not Found");
					error.status = 404;
					next(error);
				}

				res.status(200).json({ message: "Successfully deleted product" });

				const fs = require("fs");

				const path = data.product_image;

				fs.unlink(path, (err) => {
					if (err) {
						console.error(err);
						return;
					}

					//file removed
				});
			})
			.catch((err) => {
				next(err);
			});
	} catch (error) {
		next(error);
	}
};

const deleteAllProduct = (req, res, next) => {
	model.Product.destroy({ truncate: true })
		.then((result) => {
			if (!result) {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}

			res.status(200).json({ message: "Successfully deleted all products" });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	getAllProducts,
	getSpecificProduct,
	addProduct,
	updateProduct,
	deleteProduct,
	deleteAllProduct,
};
