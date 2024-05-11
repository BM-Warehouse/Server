/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const ProductService = require('@services/product.service');
const jwt = require('@libs/jwt.js');
const bcrypt = require('@libs/bcrypt');
const AuthService = require('@services/auth.service');

// Mock the ProductService
jest.mock('@services/product.service');

// Mock the AuthService
jest.mock('@services/auth.service');

// Mock jwt verify token function
jwt.verifyToken = jest.fn();

// Mock bcrypt hashPassword function
bcrypt.hashPassword = jest.fn();

describe('Product Routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the ProductService.getAll function
      ProductService.getAll.mockResolvedValue(['Product 1', 'Product 2']);

      const response = await request(app).get('/api/products').set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: { products: ['Product 1', 'Product 2'] },
        message: 'ok',
        status: 'success',
      });
      expect(ProductService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/products/detail/:id', () => {
    it('should return a product by id', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the ProductService.getDetail function
      const productId = 1;
      ProductService.getDetail.mockResolvedValue({ id: productId, name: 'Product 1' });

      const response = await request(app)
        .get(`/api/products/detail/${productId}`)
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: { id: 1, name: 'Product 1' },
        message: 'Products retrieved successfully',
        status: 'success',
      });
      expect(ProductService.getDetail).toHaveBeenCalledWith('1');
    });
  });

  describe('POST /api/products', () => {
    it('should add a new product', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      const productData = { name: 'New Product', price: 10 };

      // Mock the ProductService.add function
      ProductService.add.mockResolvedValue(productData);

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', 'Bearer token')
        .send(productData);

      expect(response.status).toBe(200);
      expect(ProductService.add).toHaveBeenCalledWith(productData);
    });
  });

  // Add other test cases for remaining routes as needed
});
