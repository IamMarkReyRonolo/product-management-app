const model = require("../models");

const getAllProducts = async (req, res, next) => {
	try {
		const user = await model.User.findByPk(req.params.userId, {
			include: model.Product,
		});

		res
			.status(200)
			.json({ count: user.products.length, products: user.products });
	} catch (error) {
		next(error);
	}
};

const getSpecificProduct = async (req, res, next) => {
	try {
		const user = await model.User.findByPk(req.params.userId, {
			include: {
				model: model.Product,
				where: {
					id: req.params.id,
				},
				include: {
					model: model.Account,
					include: model.Profile,
				},
			},
		});

		if (!user.products) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}

		res.status(200).json(user.products);
		// const product = await model.Product.findByPk(req.params.id, {
		// 	include: model.Account,
		// });
		// if (!product) {
		// 	const error = new Error("Not found");
		// 	error.status = 404;
		// 	next(error);
		// }
		// res.status(200).json(product);
	} catch (error) {
		next(error);
	}
};

const addProduct = async (req, res, next) => {
	try {
		const user = await model.User.findByPk(req.params.userId);
		if (!user) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}

		const product = await model.Product.create({
			product_name: req.body.product_name,
			product_image: req.file.path,
			userId: user.id,
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
