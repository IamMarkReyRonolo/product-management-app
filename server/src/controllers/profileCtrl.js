const models = require("../models");

const updateProfile = (req, res, next) => {
	models.Profile.update(req.body, {
		where: { customerId: req.params.customer_id },
	})
		.then((result) => {
			if (!result) {
				const error = new Error("Not found");
				error.status = 404;
				next(error);
			}

			res.status(200).json({ message: "Successfully updated profile" });
		})
		.catch((err) => {
			next(err);
		});
};

const deleteProfile = (req, res, next) => {
	models.Profile.destroy({
		where: { customerId: req.params.customer_id },
	})
		.then((result) => {
			if (result) {
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
