module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true, // Automatically increments the ID
      primaryKey: true // Designates this column as the primary key
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Ensures usernames are unique
      validate: {
        len: [3, 50] // Username must be between 3 and 50 characters
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true, // Ensures email addresses are unique
      validate: {
        isEmail: true // Ensures email format is valid
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [6, 100] // Password must be between 6 and 100 characters
      }
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'active', // Default status is active
      validate: {
        isIn: [['active', 'inactive', 'suspended']] // Ensures valid status
      }
    },
    profilePicture: {
      type: Sequelize.STRING, // Store file name or path
      allowNull: true
    }
  }, {
    timestamps: true, // Adds createdAt and updatedAt columns automatically
    underscored: true, // Converts camelCase to snake_case column names
    indexes: [
      { unique: true, fields: ['username'] }, // Index for username
      { unique: true, fields: ['email'] } // Index for email
    ]
  });
  
  User.associate = models => {
    User.belongsToMany(models.Product, { through: 'ProductMembers', as: 'Products' });
  };
  return User;
};
