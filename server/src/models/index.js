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

const Accounting = db.define(
	"accounting",
	{
		totalExpenses: DataTypes.FLOAT,
		totalIncome: DataTypes.FLOAT,
		netIncome: DataTypes.FLOAT,
	},
	{ tableName: "accounting" }
);

Product.hasMany(Account, { onDelete: "CASCADE" });
Account.belongsTo(Product, { onDelete: "CASCADE" });

Account.belongsToMany(Customer, { through: Profile }, { onDelete: "CASCADE" });
Customer.belongsToMany(Account, { through: Profile }, { onDelete: "CASCADE" });

Account.hasMany(Profile, { onDelete: "CASCADE" });
Profile.belongsTo(Account, { onDelete: "CASCADE" });
Customer.hasMany(Profile, { onDelete: "CASCADE" });
Profile.belongsTo(Customer, { onDelete: "CASCADE" });

Product.hasOne(Accounting, { onDelete: "CASCADE" });
Accounting.belongsTo(Product, { onDelete: "CASCADE" });

module.exports = { Product, Account, Customer, Profile, Accounting };
