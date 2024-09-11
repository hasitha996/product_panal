const request = require('supertest');
const express = require('express');
const app = express();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

// Mock the dependencies
jest.mock('../models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

app.use(express.json());

// Import and configure routes
require('../routes/auth.routes')(app);

const User = db.user;
const Role = db.role;

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a user successfully', async () => {
      // Mock data
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedpassword' };
      const mockRoles = [{ name: 'user' }];
      
      User.create.mockResolvedValue(mockUser);
      Role.findAll.mockResolvedValue(mockRoles);
      User.prototype.setRoles.mockResolvedValue();

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          roles: ['user']
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User registered successfully!');
    });

    it('should return 500 on error', async () => {
      User.create.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should sign in a user successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'hashedpassword', getRoles: jest.fn().mockResolvedValue([{ name: 'user' }]) };
      
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('fake-token');

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'testuser',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBe('fake-token');
      expect(response.body.roles).toEqual(['ROLE_USER']);
    });

    it('should return 401 if password is invalid', async () => {
      const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
      
      bcrypt.compareSync.mockReturnValue(false);

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid Password!');
    });

    it('should return 500 on error', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'testuser',
          password: 'password'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('GET /api/auth/signout', () => {
    it('should sign out a user successfully', async () => {
      // Assuming signout just confirms the action and doesn't handle token invalidation here
      const response = await request(app)
        .get('/api/auth/signout')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Successfully signed out.');
    });
  });
});
