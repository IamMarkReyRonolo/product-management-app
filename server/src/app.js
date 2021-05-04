const express = require("express");
const cors = require("cors");
const db = require("./utils/dbConnection");

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// DB CONNECTION
db.authenticate()
	.then(() => {
		console.log("Database connected");
	})
	.catch((err) => {
		console.log(err);
	});

// ROUTES

// ERROR HANDLING
app.use((req, res, next) => {
	const error = new Error("Not Found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	error.status = error.status || 500;
	res.json(error.message);
});

// LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("Server is now running.");
});
