// models/Product.js

module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("Product", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      members: {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      category: {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      tag: {
        type: Sequelize.TEXT, 
        allowNull: true
      },
      nextMeeting: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      timestamps: true,
      underscored: true,
    });
  
    // Associations (assuming many-to-many relationships)
    Product.associate = models => {
      Product.belongsToMany(models.category, { through: 'ProductCategories', as: 'Categories' });
      Product.belongsToMany(models.tag, { through: 'ProductTags', as: 'Tags' });
      Product.belongsToMany(models.user, { through: 'ProductMembers', as: 'members' });
    };
  
    return Product;
  };
  