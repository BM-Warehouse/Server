/* eslint-disable no-undef */

const app = require('../../app');
const request = require('supertest');
const CategoryService = require('@services/category.service');
const jwt = require('@libs/jwt.js');
const bcrypt = require('@libs/bcrypt');
const AuthService = require('@services/auth.service');

// Mock the CategoryService
jest.mock('@services/category.service');

//Mock the AuthService
jest.mock('@services/auth.service');

//mock jwt verify token function
jwt.verifyToken = jest.fn();

//mock bcrypt hashPassword function
bcrypt.hashPassword = jest.fn();

const generateRandomData = () => ({
  name: Math.random().toString(36).substring(7),
  description: Math.random().toString(36).substring(15),
  imageUrl: `https://example.com/${Math.random().toString(36).substring(10)}.jpg`,
});

describe('Category API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  // Test to get all categories
  describe('GET /api/categories', () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    // Mock token verification
    jwt.verifyToken.mockReturnValueOnce({ id: 1 });

    it('should return all categories', async () => {
      // Mock the return value of getAllCategories method
      const mockedCategories = Array.from({ length: 5 }, generateRandomData);
      CategoryService.getAllCategories.mockResolvedValue(mockedCategories);

      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
    });
  });

  // Test to add a new category
  describe('POST /api/categories', () => {
    it('should add a new category', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the addCategory method to resolve
      CategoryService.addCategory.mockResolvedValue();

      const newCategory = generateRandomData();
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', 'Bearer token')
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'category added successfully');
    });

    it('should return 404 if required fields are missing', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the addCategory method to throw an error
      CategoryService.addCategory.mockRejectedValue(new Error('Required fields are missing'));

      const newCategory = generateRandomData();
      delete newCategory.name; // Simulate missing required field

      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', 'Bearer token')
        .send(newCategory);
      expect(response.status).toBe(404);
    });
  });

  // Test to edit a category
  describe('PUT /api/categories/:id', () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    // Mock token verification
    jwt.verifyToken.mockReturnValueOnce({ id: 1 });
    it('should edit a category', async () => {
      // Mock the editCategory method to resolve
      CategoryService.editCategory.mockResolvedValue();

      const updatedCategory = generateRandomData();

      const response = await request(app)
        .put('/api/categories/1')
        .set('Authorization', 'Bearer token')
        .send(updatedCategory);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'category edited successfully');
    });

    it('should return 404 if category not found', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });
      // Mock the editCategory method to throw an error
      CategoryService.editCategory.mockRejectedValue(new Error('Category not found'));

      const updatedCategory = generateRandomData();
      const response = await request(app)
        .put('/api/categories/9999') // Replace :id with non-existent category id
        .set('Authorization', 'Bearer token')
        .send(updatedCategory);

      expect(response.status).toBe(404);
      // Add more expectations for error response if needed
    });
  });

  // Test to remove a category
  describe('DELETE /api/categories/:id', () => {
    it('should remove a category', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });
      // Mock the removeCategory method to resolve
      CategoryService.removeCategory.mockResolvedValue();

      const categoryId = Math.floor(Math.random() * 1000); // Generate random category id
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Category deleted successfully');
    });

    it('should return 404 if category not found', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the removeCategory method to throw an error
      CategoryService.removeCategory.mockRejectedValue(new Error('Category not found'));

      // Generate random non - existent category id
      const nonExistentCategoryId = Math.floor(Math.random() * 1000);

      const response = await request(app)
        .delete(`/api/categories/${nonExistentCategoryId}`)
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(404);
    });
  });

  // Test to get products by category
  describe('GET /api/categories/:id', () => {
    it('should return products by category', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the getProductByCategory method to resolve
      const mockedProducts = Array.from({ length: 5 }, generateRandomData);
      CategoryService.getProductByCategory.mockResolvedValue(mockedProducts);

      const response = await request(app)
        .get('/api/categories/123')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'OK');
    });

    it('should return 404 if category not found', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock the getProductByCategory method to throw an error
      CategoryService.getProductByCategory.mockRejectedValue(new Error('Category not found'));

      const response = await request(app)
        .get('/api/categories/products')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(404);
    });
  });
});
