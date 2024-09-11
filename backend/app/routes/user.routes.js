const { authJwt } = require("../middleware");
const { uploadProfilePicture, updateProfile,getUserDetails } = require('../controllers/profile.controller');

module.exports = function(app) {
  // Set headers to allow CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
  });

  // PUT request to update the user profile
  app.post('/api/users/update', [authJwt.verifyToken, uploadProfilePicture], updateProfile);
  app.get('/api/users_det/:id', [authJwt.verifyToken], getUserDetails);

};
