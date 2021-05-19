const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
	const token = req.header("auth-token");
	if (!token) {
		const error = new Error("Access Denied");
		error.status = 403;
		next(error);
	} else {
		try {
			const verified = jwt.verify(token, process.env.TOKEN_SECRET);
			if (!verified) {
				const error = new Error("Invalid Token");
				error.status = 403;
				next(error);
			} else {
				req.user = verified;
				next();
			}
		} catch (error) {
			next(error);
		}
	}
};

module.exports = { authenticate };
