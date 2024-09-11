module.exports = (sequelize, Sequelize) => {
  const Tag = sequelize.define("Tag", {
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

  Tag.associate = models => {
      Tag.belongsToMany(models.Product, { through: 'ProductTags', as: 'Products' });
  };

  return Tag;
};
