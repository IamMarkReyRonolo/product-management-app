const model = require("../models");

const getAllProducts = (req, res, next) => {
	model.Product.findAll()
		.then((result) => {
			if (!result) {
				const error = new Error("Product not found");
				error.status = 404;
				next(error);
			}
			res.status(200).json({ count: result.length, products: { result } });
		})
		.catch((err) => {
			next(err);
		});
};

const getSpecificProduct = async (req, res, next) => {
	try {
		const product = await model.Product.findByPk(req.params.id, {
			include: model.Account,
		});
		if (!product) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
		res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const addProduct = async (req, res, next) => {
	try {
		const product = await model.Product.create({
			product_name: req.body.product_name,
			product_image: req.file.path,
		});

		const accounting = await model.Accounting.create({
			totalExpenses: 0,
			totalIncome: 0,
			netIncome: 0,
			productId: product.id,
		});

		res.status(201).json({
			message: "Successfully created product",
			result: { product, accounting },
		});
	} catch (error) {
		next(error);
	}
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
		const data = await model.Product.findByPk(req.params.id);

		// await data.removeAccounting();
		// await data.removeAccounts();

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
			if (result) {
				res.status(200).json({ message: "Successfully deleted all products" });
			} else {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
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
