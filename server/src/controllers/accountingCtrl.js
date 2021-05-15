const model = require("../models");
const logCtrl = require("../controllers/logCtrl");
const getAccounting = async (req, res, next) => {
	try {
		const product = await model.Product.findByPk(req.params.product_id, {
			include: [model.Accounting, model.Account],
		});

		if (product) {
			const accounting = await model.Accounting.findByPk(
				product.accounting.id,
				{
					include: [model.Log],
				}
			);

			res.status(200).json({
				product_id: product.id,
				product_name: product.product_name,
				product_image: product.product_image,
				totalAccounts: product.accounts.length,
				accounting: product.accounting,
				logs: accounting.logs,
			});
		} else {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

const updateAccountingAccountUpdation = async (
	req,
	res,
	next,
	product_id,
	message
) => {
	try {
		const product = await model.Product.findByPk(product_id, {
			include: [model.Accounting, model.Account],
		});

		if (product) {
			let expense = 0;
			let income = 0;
			product.accounts.forEach((account) => {
				expense += account.original_price;
				income += account.selling_price;
			});

			let netIncome = income - expense;
			product.accounting = {
				id: product.accounting.id,
				totalExpenses: expense,
				totalIncome: income,
				netIncome: netIncome,
			};

			const accountingUpdate = await model.Accounting.update(
				product.accounting,
				{ where: { productId: product_id } }
			);

			if (accountingUpdate) {
				console.log("successfully updated accounting");
			}

			console.log(product.accounting.id);

			await logCtrl.addLog(message, product.accounting.id, next);
		} else {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

const updateAccountingAccountCreation = async (
	req,
	res,
	next,
	product_id,
	message
) => {
	try {
		const product = await model.Product.findByPk(product_id, {
			include: [model.Accounting, model.Account],
		});

		if (product) {
			const accounting = await model.Accounting.findOne({
				where: { productId: product_id },
			});

			let expense =
				accounting.totalExpenses +
				product.accounts[product.accounts.length - 1].original_price;
			let income =
				accounting.totalIncome +
				product.accounts[product.accounts.length - 1].selling_price;

			let netIncome = income - expense;
			product.accounting = {
				id: product.accounting.id,
				totalExpenses: expense,
				totalIncome: income,
				netIncome: netIncome,
			};

			const accountingUpdate = await model.Accounting.update(
				product.accounting,
				{ where: { productId: product_id } }
			);

			if (accountingUpdate) {
				console.log("successfully updated accounting");
			}

			await logCtrl.addLog(message, product.accounting.id, next);
		} else {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

const updateLogsThroughAccId = async (req, res, next, product_id, message) => {
	try {
		const product = await model.Product.findByPk(product_id, {
			include: [model.Accounting, model.Account],
		});

		if (product) {
			await logCtrl.addLog(message, product.accounting.id, next);
		} else {
			const error = new Error("Not found");
			error.status = 404;
			next(error);
		}
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getAccounting,
	updateAccountingAccountCreation,
	updateAccountingAccountUpdation,
	updateLogsThroughAccId,
};
