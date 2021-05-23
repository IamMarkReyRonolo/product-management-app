const models = require("../models");

const accountingCtrl = require("../controllers/accountingCtrl");

const updateProfile = async (req, res, next) => {
	const prof = await models.Profile.findOne({
		where: {
			customerId: req.params.customer_id,
			accountId: req.params.accountId,
		},
		include: [models.Account, models.Customer],
	});

	const oldPrice = prof.subscription_price;

	models.Profile.update(req.body, {
		where: {
			customerId: req.params.customer_id,
			accountId: req.params.accountId,
		},
	})
		.then(async (result) => {
			if (!result) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}

			const message = `Updated ${prof.customer.customer_firstname} ${prof.customer.customer_lastname}'s subscription to account "${prof.account.account_name}" at ₱"${req.body.subscription_price}"`;

			console.log("asdasd");
			console.log(message);
			console.log("asdasd");
			await accountingCtrl.updateAccountingProfileUpdation(
				req,
				res,
				next,
				prof.account.productId,
				oldPrice,
				req.body.subscription_price,
				message
			);

			res.status(200).json({ message: "Successfully updated profile" });
		})
		.catch((err) => {
			next(err);
		});
};

const deleteProfile = async (req, res, next) => {
	const account = await models.Account.findByPk(req.params.accountId, {
		include: {
			model: models.Profile,
			where: { customerId: req.params.customer_id },
			include: models.Customer,
		},
	});

	console.log("qqqqqqqqqq");

	console.log(account);
	console.log("qqqqqqqqqq");

	models.Profile.destroy({
		where: {
			customerId: req.params.customer_id,
			accountId: req.params.accountId,
		},
	})
		.then(async (result) => {
			if (result) {
				const message = `Deleted profile in "${account.account_name}" owned by ${account.profiles[0].customer.customer_firstname} ${account.profiles[0].customer.customer_lastname}. `;
				console.log(message);
				await accountingCtrl.updateLogsThroughAccId(
					req,
					res,
					next,
					account.productId,
					message
				);

				res.status(200).json({ message: "Successfully deleted profile" });
			}
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	updateProfile,
	deleteProfile,
};
