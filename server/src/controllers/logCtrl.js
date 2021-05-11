const models = require("../models");

const addLog = async (message, accountingId, next) => {
	const accounting = await models.Accounting.findByPk(accountingId);
	if (!accounting) {
		const error = new Error("Product not found. Cannot add account");
		error.status = 404;
		next(error);
	}

	const log = await models.Log.create({
		logMessage: message,
		accountingId: accountingId,
	});

	if (log) {
		console.log(message);
	}
};

module.exports = { addLog };
