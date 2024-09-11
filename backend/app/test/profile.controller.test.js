const request = require('supertest');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Mock the dependencies
jest.mock('fs');
jest.mock('multer');
jest.mock('../models'); 

const db = require('../models');
const User = db.user;

const { uploadProfilePicture, updateProfile, getUserDetails } = require('../controllers/profile.controller');
const { authJwt } = require('../middleware');

// Mock middleware
jest.mock('../middleware', () => ({
  authJwt: {
    verifyToken: (req, res, next) => next()
  }
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up routes
require('../routes/profile.routes')(app);

// Test suite
describe('Profile Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/update', () => {
    it('should update the user profile successfully', async () => {
      const mockUser = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active', profilePicture: 'old-pic.jpg', save: jest.fn() };
      
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      fs.unlink = jest.fn();

      const response = await request(app)
        .post('/api/users/update')
        .attach('profile_picture', 'path/to/test-image.jpg') // Mock file upload
        .send({
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          status: 'active'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile updated successfully');
      expect(mockUser.save).toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalled();
    });

    it('should return 422 if user not found', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/update')
        .send({
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          status: 'active'
        });

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('user not found');
    });

    it('should return 500 on error', async () => {
      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/users/update')
        .send({
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          status: 'active'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to save profile');
    });
  });

  describe('GET /api/users_det/:id', () => {
    it('should get user details successfully', async () => {
      const mockUser = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', status: 'active' };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users_det/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 422 if user not found', async () => {
      User.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users_det/1');

      expect(response.status).toBe(422);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 500 on error', async () => {
      User.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/users_det/1');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to fetch user details');
    });
  });
});
