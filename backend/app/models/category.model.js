module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("Category", {
      id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false
      }
  }, {
      timestamps: true,
      underscored: true,
  });

  Category.associate = models => {
      Category.belongsToMany(models.Product, { through: 'ProductCategories', as: 'Products' });
  };

  return Category;
};
