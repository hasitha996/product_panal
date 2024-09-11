const request = require('supertest');
const express = require('express');
const app = express();
const { authJwt } = require('../middleware');
const db = require('../models');
const Product = db.product;
const Category = db.category;
const Tag = db.tag;
const User = db.user;

// Mock the dependencies
jest.mock('../models');
jest.mock('../middleware', () => ({
  authJwt: {
    verifyToken: (req, res, next) => next()
  }
}));

app.use(express.json());

// Set up routes
require('../routes/product.routes')(app);

// Test suite
describe('Product Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/create_products', () => {
    it('should create a new product successfully', async () => {
      const mockProduct = { id: 1, brand: 'Brand A', description: 'Product A', members: '[]', category: '[]', tag: '[]', nextMeeting: '2024-01-01', setCategories: jest.fn(), setTags: jest.fn(), save: jest.fn() };
      Product.create = jest.fn().mockResolvedValue(mockProduct);
      Product.prototype.setCategories = jest.fn();
      Product.prototype.setTags = jest.fn();

      const response = await request(app)
        .post('/api/create_products')
        .set('x-access-token', 'fake-token')
        .send({
          brand: 'Brand A',
          description: 'Product A',
          members: [],
          categories: [],
          tags: [],
          nextMeeting: '2024-01-01'
        });

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProduct);
    });

    it('should return 500 on error', async () => {
      Product.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/create_products')
        .set('x-access-token', 'fake-token')
        .send({
          brand: 'Brand A',
          description: 'Product A',
          members: [],
          categories: [],
          tags: [],
          nextMeeting: '2024-01-01'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to create product');
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve all products successfully', async () => {
      const mockProducts = [{ id: 1, brand: 'Brand A', description: 'Product A', members: '[]', Categories: [], Tags: [] }];
      const mockCategories = [{ id: 1, name: 'Category A' }];
      const mockTags = [{ id: 1, name: 'Tag A' }];
      const mockMembers = [{ id: 1, first_name: 'John' }];

      Product.findAll = jest.fn().mockResolvedValue(mockProducts);
      Category.findAll = jest.fn().mockResolvedValue(mockCategories);
      Tag.findAll = jest.fn().mockResolvedValue(mockTags);
      User.findAll = jest.fn().mockResolvedValue(mockMembers);

      const response = await request(app)
        .get('/api/products')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(200);
      expect(response.body.products).toEqual(mockProducts);
      expect(response.body.categories).toEqual(mockCategories);
      expect(response.body.tags).toEqual(mockTags);
      expect(response.body.members).toEqual(mockMembers);
    });

    it('should return 500 on error', async () => {
      Product.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/products')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to retrieve products');
    });
  });

  describe('GET /api/one_product/:id', () => {
    it('should retrieve a single product by ID successfully', async () => {
      const mockProduct = { id: 1, brand: 'Brand A', description: 'Product A' };

      Product.findByPk = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .get('/api/one_product/1')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      Product.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .get('/api/one_product/1')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 500 on error', async () => {
      Product.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/one_product/1')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('PUT /api/product_update/:id', () => {
    it('should update a product by ID successfully', async () => {
      const mockProduct = { id: 1, brand: 'Brand A', description: 'Product A', save: jest.fn(), setCategories: jest.fn(), setTags: jest.fn() };

      Product.findByPk = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/api/product_update/1')
        .set('x-access-token', 'fake-token')
        .send({
          brand: 'Brand B',
          description: 'Updated Product',
          members: [],
          categories: [],
          tags: [],
          nextMeeting: '2024-02-01'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product updated successfully');
    });

    it('should return 404 if product not found', async () => {
      Product.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .put('/api/product_update/1')
        .set('x-access-token', 'fake-token')
        .send({
          brand: 'Brand B',
          description: 'Updated Product',
          members: [],
          categories: [],
          tags: [],
          nextMeeting: '2024-02-01'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 500 on error', async () => {
      Product.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/product_update/1')
        .set('x-access-token', 'fake-token')
        .send({
          brand: 'Brand B',
          description: 'Updated Product',
          members: [],
          categories: [],
          tags: [],
          nextMeeting: '2024-02-01'
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to update product');
    });
  });

  describe('DELETE /api/product_delete/:id', () => {
    it('should delete a product by ID successfully', async () => {
      const mockProduct = { id: 1, destroy: jest.fn() };

      Product.findByPk = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .delete('/api/product_delete/1')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');
    });

    it('should return 404 if product not found', async () => {
      Product.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/product_delete/1')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 500 on error', async () => {
      Product.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/product_delete/1')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to delete product');
    });
  });

  describe('GET /api/categories', () => {
    it('should retrieve all categories successfully', async () => {
      const mockCategories = [{ id: 1, name: 'Category A' }];

      Category.findAll = jest.fn().mockResolvedValue(mockCategories);

      const response = await request(app)
        .get('/api/categories')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCategories);
    });

    it('should return 500 on error', async () => {
      Category.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/categories')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to retrieve categories');
    });
  });

  describe('GET /api/tags', () => {
    it('should retrieve all tags successfully', async () => {
      const mockTags = [{ id: 1, name: 'Tag A' }];

      Tag.findAll = jest.fn().mockResolvedValue(mockTags);

      const response = await request(app)
        .get('/api/tags')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTags);
    });

    it('should return 500 on error', async () => {
      Tag.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/tags')
        .set('x-access-token', 'fake-token');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to retrieve tags');
    });
  });
});
