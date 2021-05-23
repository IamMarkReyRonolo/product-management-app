const express = require("express");
const cors = require("cors");
const db = require("./utils/dbConnection");
const models = require("./models");
const auth = require("./controllers/auth");

const app = express();

// MIDDLEWARES
app.use("/src/uploads", express.static("/src/uploads"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB CONNECTION

db.authenticate()
	.then(() => {
		db.sync({ alter: true }).then(() => {
			console.log("Database is sync");
			console.log("Database connected");
		});
	})
	.catch((err) => {
		console.log(err);
	});

// ROUTES

app.get("/posts", auth.authenticate, (req, res) => {
	data = {
		post: "Wasappppp",
		user: req.user,
	};

	res.json(data);
});

const productAPI = require("./apis/productAPI");
const accountAPI = require("./apis/accountAPI");
const customerAPI = require("./apis/customerAPI");
const profileAPI = require("./apis/profileAPI");
const accountingAPI = require("./apis/accountingAPI");
const userAPI = require("./apis/userAPI");

app.use("/api/users", userAPI);
app.use("/api/", productAPI);
app.use("/api", accountAPI);
app.use("/api/", customerAPI);
app.use("/api", profileAPI);
app.use("/api", accountingAPI);

// ERROR HANDLING
app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	error.status = error.status || 500;
	res.status(error.status).json({ error_message: error.message });
});

// LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("Server is now running.");
});
