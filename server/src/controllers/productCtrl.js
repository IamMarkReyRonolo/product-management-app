const model = require("../models");
const fileUp = require("../utils/cloudinary");
const nodeCache = require("../utils/nodeCache");

const getAllProducts = async (req, res, next) => {
	try {
		const productCacheKey = `${req.params.userId}/products`;
		const cachedData = nodeCache.get(req, res, next, productCacheKey);
		if (cachedData) {
			res.status(200).json(cachedData);
		} else {
			const user = await model.User.findByPk(req.params.userId, {
				include: model.Product,
			});
			const data = { count: user.products.length, products: user.products };

			nodeCache.set(req, data, next, productCacheKey);

			res.status(200).json(data);
		}
	} catch (error) {
		next(error);
	}
};

const getSpecificProduct = async (req, res, next) => {
	try {
		const specificProductCacheKey = `${req.params.userId}/products/${req.params.productId}`;
		const cachedData = nodeCache.get(req, res, next, specificProductCacheKey);
		if (cachedData) {
			res.status(200).json(cachedData);
		} else {
			const user = await model.User.findByPk(req.params.userId, {
				include: {
					model: model.Product,
					where: {
						id: req.params.productId,
					},
					include: model.Account,
				},
			});

			if (!user.products) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}
			const data = user.products;
			nodeCache.set(req, data, next, specificProductCacheKey);

			res.status(200).json(data);
		}
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

		const uploadRes = await fileUp.cloudinary.uploader.upload(
			req.body.product_image,
			{ upload_preset: "product-management" }
		);

		const product = await model.Product.create({
			product_name: req.body.product_name,
			product_image: uploadRes.url,
			userId: user.id,
		});

		const accounting = await model.Accounting.create({
			totalExpenses: 0,
			totalIncome: 0,
			netIncome: 0,
			productId: product.id,
		});

		const productCacheKey = `${req.params.userId}/products`;
		nodeCache.clear(req, res, next, productCacheKey);

		res.status(201).json({
			message: "Successfully created product",
			result: { product, accounting },
		});
	} catch (error) {
		next(error);
	}
};

const updateProduct = async (req, res, next) => {
	const uploadRes = await fileUp.cloudinary.uploader.upload(
		req.body.product_image,
		{ upload_preset: "product-management" }
	);

	model.Product.update(
		{ product_name: req.body.product_name, product_image: uploadRes.url },
		{ where: { id: req.params.productId } }
	)
		.then((result) => {
			if (!result) {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}

			const productCacheKey = `${req.params.userId}/products`;
			nodeCache.clear(req, res, next, productCacheKey);
			const specificProductCacheKey = `${req.params.userId}/products/${req.params.productId}`;
			nodeCache.clear(req, res, next, specificProductCacheKey);

			res.status(200).json({ message: "Successfully updated product" });
		})
		.catch((err) => {
			next(err);
		});
};

const deleteProduct = async (req, res, next) => {
	try {
		model.Product.destroy({ where: { id: req.params.productId } })
			.then((result) => {
				if (!result) {
					const error = new Error("Not Found");
					error.status = 404;
					next(error);
				}

				const productCacheKey = `${req.params.userId}/products`;
				nodeCache.clear(req, res, next, productCacheKey);
				const productCacheKey2 = `${req.params.userId}/customers`;
				nodeCache.clear(req, res, next, productCacheKey2);
				const productCacheKey3 = `${req.params.userId}/${req.params.productId}/accounting`;
				nodeCache.clear(req, res, next, productCacheKey3);

				res.status(200).json({ message: "Successfully deleted product" });
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
