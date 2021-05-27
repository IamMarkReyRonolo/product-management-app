const models = require("../models");
const accountingCtrl = require("../controllers/accountingCtrl");
const nodeCache = require("../utils/nodeCache");

const getSpecificAccount = async (req, res, next) => {
	const product = await models.Product.findOne({
		where: { id: req.params.product_id, userId: req.params.userId },
	});

	if (!product) {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	}

	models.Account.findOne({
		where: { productId: req.params.product_id, id: req.params.account_id },
		include: [models.Product, models.Customer],
	})
		.then((result) => {
			if (!result) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}

			res.status(200).json({ account: result });
		})
		.catch((err) => {
			next(err);
		});
};

const addAccount = async (req, res, next) => {
	try {
		const prod = await models.Product.findByPk(req.params.product_id);
		if (!prod) {
			const error = new Error("Product not found. Cannot add account");
			error.status = 404;
			next(error);
		}
		const acc = await models.Account.create({
			account_name: req.body.account_name,
			account_type: req.body.account_type,
			account_username: req.body.account_username,
			account_password: req.body.account_password,
			original_price: req.body.original_price,
			date_purchased: req.body.date_purchased,
			date_expires: req.body.date_expires,
			productId: prod.id,
		});

		const message = `Purchased account "${acc.account_name}" at ₱ ${
			acc.original_price
		} on ${req.body.date_purchased.toString().substr(0, 10)}`;

		await accountingCtrl.updateAccountingAccountCreation(
			req,
			res,
			next,
			req.params.product_id,
			message
		);

		const accountingCacheKey = `${req.params.userId}/${req.params.product_id}/accounting`;
		const specificProductCacheKey = `${req.params.userId}/products/${req.params.product_id}`;
		nodeCache.clear(req, res, next, accountingCacheKey);
		nodeCache.clear(req, res, next, specificProductCacheKey);

		res
			.status(201)
			.json({ message: "Successfully created account", account: acc });
	} catch (error) {
		next(error);
	}
};

const addExistingCustomer = async (req, res, next) => {
	try {
		const account = await models.Account.findByPk(req.params.account_id);
		if (!account) {
			const error = new Error("Account not found.");
			error.status = 404;
			next(error);
		}

		const customer = await models.Customer.findByPk(req.params.customer_id);
		if (!customer) {
			const error = new Error("Customer not found.");
			error.status = 404;
			next(error);
		}

		await account.addCustomer(customer, {
			through: {
				profile_pin: req.body.profile_pin,
				subscription_status: req.body.subscription_status,
				subscription_price: req.body.subscription_price,
				subscription_purchased: req.body.subscription_purchased,
				subscription_expires: req.body.subscription_expires,
			},
		});

		const message = `${customer.customer_firstname} ${
			customer.customer_lastname
		} subscribed to account "${account.account_name}" at ₱"${
			req.body.subscription_price
		}" on ${req.body.subscription_purchased.toString().substr(0, 10)}`;

		await accountingCtrl.updateAccountingProfileSubscription(
			req,
			res,
			next,
			account.productId,
			req.body.subscription_price,
			message
		);

		const result = await models.Account.findOne({
			where: { id: req.params.account_id },
			include: models.Customer,
		});

		const accountingCacheKey = `${req.params.userId}/${req.params.productId}/accounting`;
		const productCacheKey2 = `${req.params.userId}/customers`;
		nodeCache.clear(req, res, next, accountingCacheKey);
		nodeCache.clear(req, res, next, productCacheKey2);

		res.status(201).json({ account: result });
	} catch (error) {
		next(error);
	}
};

const updateAccount = async (req, res, next) => {
	const updatedAccount = await models.Account.update(req.body, {
		where: { id: req.params.account_id },
	});

	if (!updatedAccount) {
		const error = new Error("Not found");
		error.status = 404;
		next(error);
	}

	const acc = await models.Account.findByPk(req.params.account_id);
	const message = `Updated account "${acc.account_name}". Price: ${acc.original_price} `;
	await accountingCtrl.updateAccountingAccountUpdation(
		req,
		res,
		next,
		req.params.product_id,
		message
	);

	const accountingCacheKey = `${req.params.userId}/${req.params.product_id}/accounting`;
	const specificProductCacheKey = `${req.params.userId}/products/${req.params.product_id}`;
	const productCacheKey2 = `${req.params.userId}/customers`;
	nodeCache.clear(req, res, next, accountingCacheKey);
	nodeCache.clear(req, res, next, specificProductCacheKey);
	nodeCache.clear(req, res, next, productCacheKey2);

	res.status(200).json({ message: "Successfully updated product" });
};

const deleteAccount = async (req, res, next) => {
	try {
		const acc = await models.Account.findByPk(req.params.account_id);
		const account = await models.Account.destroy({
			where: { id: req.params.account_id },
		});

		if (!account) {
			const error = new Error("Not Found");
			error.status = 404;
			next(error);
		} else {
			const message = `Deleted account "${acc.account_name}". `;

			await accountingCtrl.updateLogsThroughAccId(
				req,
				res,
				next,
				req.params.product_id,
				message
			);

			const accountingCacheKey = `${req.params.userId}/${req.params.product_id}/accounting`;
			const specificProductCacheKey = `${req.params.userId}/products/${req.params.product_id}`;
			const productCacheKey2 = `${req.params.userId}/customers`;
			nodeCache.clear(req, res, next, accountingCacheKey);
			nodeCache.clear(req, res, next, specificProductCacheKey);
			nodeCache.clear(req, res, next, productCacheKey2);

			res.status(200).json({ message: "Successfully deleted account" });
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getSpecificAccount,
	addAccount,
	updateAccount,
	deleteAccount,
	addExistingCustomer,
};
