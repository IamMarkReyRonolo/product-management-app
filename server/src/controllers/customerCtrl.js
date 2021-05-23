const models = require("../models");
const accountingCtrl = require("../controllers/accountingCtrl");

const getAllCustomers = async (req, res, next) => {
	console.log(req.params.userId);
	console.log("yeahhhhhhhhhh");

	try {
		const user = await models.User.findByPk(req.params.userId, {
			include: { model: models.Customer, include: models.Profile },
		});

		res
			.status(200)
			.json({ count: user.customers.length, customers: user.customers });
	} catch (error) {
		next(error);
	}

	// models.Customer.findAll({ include: [models.Profile] })
	// 	.then((result) => {
	// 		if (!result) {
	// 			const error = new Error("Not found");
	// 			error.status = 404;
	// 			next(error);
	// 		}
	// 	})
	// 	.catch((err) => {
	// 		next(err);
	// 	});
};
const getSpecificCustomer = async (req, res, next) => {
	try {
		const user = await models.User.findByPk(req.params.userId, {
			include: {
				model: models.Customer,
				where: { id: req.params.customer_id },
				include: models.Account,
			},
		});

		if (!user.customers) {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}

		res.status(200).json(user.customers[0]);
	} catch (error) {
		next(error);
	}
};

const addCustomer = async (req, res, next) => {
	try {
		const account = await models.Account.findByPk(req.params.account_id);
		if (!account) {
			const error = new Error("Account not found.");
			error.status = 404;
			next(error);
		}

		const customer = await models.Customer.create({
			customer_firstname: req.body.customer_firstname,
			customer_lastname: req.body.customer_lastname,
			customer_phone: req.body.customer_phone,
			customer_email: req.body.customer_email,
			userId: req.params.userId,
		});

		await account.addCustomer(customer, {
			through: {
				profile_pin: req.body.profile_pin,
				subscription_status: req.body.subscription_status,
				subscription_price: req.body.subscription_price,
				subscription_purchased: req.body.subscription_purchased,
				subscription_expires: req.body.subscription_expires,
			},
		});

		const message = `${req.body.customer_firstname} ${
			req.body.customer_lastname
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

		res.status(201).json({ account: result });
	} catch (error) {
		next(error);
	}
};

const addIndirectCustomer = async (req, res, next) => {
	try {
		const customer = await models.Customer.create({
			customer_firstname: req.body.customer_firstname,
			customer_lastname: req.body.customer_lastname,
			customer_phone: req.body.customer_phone,
			customer_email: req.body.customer_email,
			userId: req.params.userId,
		});

		res.status(201).json({ customer: customer });
	} catch (error) {
		next(error);
	}
};

const updateCustomer = (req, res, next) => {
	models.Customer.update(
		{
			customer_firstname: req.body.customer_firstname,
			customer_lastname: req.body.customer_lastname,
			customer_phone: req.body.customer_phone,
			customer_email: req.body.customer_email,
		},
		{
			where: { id: req.params.customer_id },
		}
	)
		.then((result) => {
			if (!result) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}

			res.status(200).json({ message: "Successfully updated customer" });
		})
		.catch((err) => {
			next(err);
		});
};

const deleteCustomer = async (req, res, next) => {
	models.Customer.destroy({ where: { id: req.params.customer_id } })
		.then((result) => {
			if (!result) {
				const error = new Error("Not Found");
				error.status = 404;
				next(error);
			}
			res.status(200).json({ message: "Successfully deleted customer" });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	getAllCustomers,
	getSpecificCustomer,
	addCustomer,
	addIndirectCustomer,
	updateCustomer,
	deleteCustomer,
};
