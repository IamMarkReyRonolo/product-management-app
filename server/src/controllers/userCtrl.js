const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeCache = require("../utils/nodeCache");

const signUp = async (req, res, next) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const exist = await models.User.findOne({
			where: { username: req.body.username },
		});

		if (exist) {
			const error = new Error("Email already exists");
			error.status = 401;
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
	try {
		const exist = await models.User.findOne({
			where: { username: req.body.username },
		});

		if (!exist) {
			const error = new Error("Email does not exist");
			error.status = 400;
			next(error);
		}

		const pass = await bcrypt.compare(req.body.password, exist.password);
		if (!pass) {
			const error = new Error("Password is wrong");
			error.status = 400;
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
	} catch (error) {
		next(error);
	}
};

const getUser = async (req, res, next) => {
	try {
		const userCacheKey = `users/${req.params.token}`;
		const cachedData = nodeCache.get(req, res, next, userCacheKey);
		if (cachedData) {
			res.status(200).json(cachedData);
		} else {
			const user = await models.User.findByPk(req.user);
			if (user) {
				nodeCache.set(req, user, next, userCacheKey);
				res.status(200).json(user);
			} else {
				const error = new Error("User not found");
				error.status = 404;
				next(error);
			}
		}
	} catch (error) {
		next(error);
	}
};

module.exports = { logIn, signUp, getUser };
