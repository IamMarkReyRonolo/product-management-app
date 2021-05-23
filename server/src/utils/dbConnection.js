const { Sequelize } = require("sequelize");

require("dotenv").config();

const db = new Sequelize(process.env.DATABASE_URL);

module.exports = db;
