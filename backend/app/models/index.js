const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.tag = require("../models/tag.model.js")(sequelize, Sequelize);

// Define many-to-many relationships
db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.product.belongsToMany(db.category, { through: "ProductCategory", foreignKey: "product_id" });
db.category.belongsToMany(db.product, { through: "ProductCategory", foreignKey: "category_id" });

db.product.belongsToMany(db.tag, { through: "ProductTag", foreignKey: "product_id" });
db.tag.belongsToMany(db.product, { through: "ProductTag", foreignKey: "tag_id" });
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
