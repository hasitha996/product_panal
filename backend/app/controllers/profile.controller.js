const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Op = db.Sequelize.Op;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Save or update user profile
const saveProfile = async (req, res) => {
  try {
    const { id, first_name, last_name, email, password, status } = req.body;
    let profilePicture = req.file ? req.file.filename : '';

    // Check if it's an update request (user already exists)
    let user = await User.findOne({ where: { id: id } }); // Sequelize's method to find by primary key

    if (user) {
      // If there's a new image, remove the old one
      if (profilePicture && user.profilePicture) {
        fs.unlink(path.join(__dirname, '../uploads', user.profilePicture), (err) => {
          if (err) console.error("Failed to delete old profile picture:", err);
        });
      }

      // Update existing user fields
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.status = status || user.status;
      user.profilePicture =req.file.filename;

      await user.save();
      return res.json({ message: 'Profile updated successfully', user });
    } else {
      return res.status(422).json({ message: 'user not found', error });
    }
  } catch (error) {
    console.error("Error saving profile", error);
    return res.status(500).json({ message: 'Failed to save profile', error });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from route parameters

    // Find the user by ID
    const user = await User.findByPk(id); // Sequelize's method to find by primary key
    if (!user) {
      return res.status(422).json({ message: 'User not found' });
    }

    // Return the user details
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details', error });
  }
};


// Export the upload middleware and saveProfile function
module.exports = {
  uploadProfilePicture: upload.single('profile_picture'),
  updateProfile: saveProfile,
  getUserDetails:getUserDetails
};