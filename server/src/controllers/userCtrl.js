const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUp = async (req, res, next) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const exist = await models.User.findOne({
			where: { username: req.body.username },
		});

		if (exist) {
			const error = new Error("Email already exists");
			error.status = 403;
			next(error);
		} else {
			const user = await models.User.create({
				fullname: req.body.fullname,
				username: req.body.username,
				password: hashPassword,
			});

			res.status(200).json({
				success_message: "Successfully created account",
			});
		}
	} catch (error) {
		next(error);
	}
};

const logIn = async (req, res, next) => {
	console.log(req.body.username);
	console.log("------------------------------");
	const exist = await models.User.findOne({
		where: { username: req.body.username },
	});
	console.log("------------------------------");

	if (!exist) {
		const error = new Error("Email is wrong");
		error.status = 403;
		next(error);
	}

	const pass = await bcrypt.compare(req.body.password, exist.password);
	if (!pass) {
		const error = new Error("Password is wrong");
		error.status = 403;
		next(error);
	}

	const token = await jwt.sign(exist.id, process.env.TOKEN_SECRET);
	res.header("auth-token", token);

	res.status(200).json({
		success_message: "You are logged in",
		user: {
			id: exist.id,
			fullname: exist.fullname,
			token: token,
		},
	});
};

module.exports = { logIn, signUp };
