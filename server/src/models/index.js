const { DataTypes } = require("sequelize");
const db = require("../utils/dbConnection");

const Product = db.define(
	"product",
	{
		product_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		product_image: {
			type: DataTypes.STRING,
		},
	},
	{ tableName: "product" }
);

const Account = db.define(
	"account",
	{
		account_name: DataTypes.STRING,
		account_type: DataTypes.STRING,
		account_username: DataTypes.STRING,
		account_password: DataTypes.STRING,
		original_price: DataTypes.FLOAT,
		selling_price: DataTypes.FLOAT,
		date_purchased: DataTypes.DATE,
		date_expires: DataTypes.DATE,
	},
	{ tableName: "account" }
);
const Customer = db.define(
	"customer",
	{
		customer_firstname: DataTypes.STRING,
		customer_lastname: DataTypes.STRING,
		customer_phone: DataTypes.STRING,
		customer_email: DataTypes.STRING,
	},
	{ tableName: "customer" }
);

const Profile = db.define(
	"profile",
	{
		profile_pin: DataTypes.INTEGER,
		subscription_status: DataTypes.STRING,
		subscription_price: DataTypes.FLOAT,
		subscription_purchased: DataTypes.DATE,
		subscription_expires: DataTypes.DATE,
	},
	{ timestamps: false, tableName: "profile" }
);

Product.hasMany(Account);
Account.belongsTo(Product);

Account.belongsToMany(Customer, { through: Profile });
Customer.belongsToMany(Account, { through: Profile });

Account.hasMany(Profile);
Profile.belongsTo(Account);
Customer.hasMany(Profile);
Profile.belongsTo(Customer);

module.exports = { Product, Account, Customer, Profile };
