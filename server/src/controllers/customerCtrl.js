const models = require("../models");

const getAllCustomers = (req, res, next) => {
	models.Customer.findAll()
		.then((result) => {
			if (!result) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}

			res.status(200).json({ count: result.length, customers: result });
		})
		.catch((err) => {
			next(err);
		});
};
const getSpecificCustomer = (req, res, next) => {
	models.Customer.findByPk(req.params.customer_id, {
		include: [models.Account],
	})
		.then((result) => {
			if (!result) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}

			res.status(200).json(result);
		})
		.catch((err) => {
			next(err);
		});
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
		});

		await account.addCustomer(customer, {
			through: {
				profile_pin: req.body.profile_pin,
				subscription_status: req.body.subscription_status,
				subscription_price: req.body.subscription_price,
			},
		});

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
