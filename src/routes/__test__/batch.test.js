/* eslint-disable no-undef */

const app = require('../../app'); // Adjust the path to your app
const request = require('supertest');
const BatchService = require('@services/batch.service'); // Adjust the path to your BatchService
const AuthService = require('@services/auth.service'); // Adjust the path to your AuthService
const jwt = require('@libs/jwt.js'); // Adjust the path to your jwt library

// Mock the BatchService
jest.mock('@services/batch.service');

// Mock the AuthService
jest.mock('@services/auth.service');

// Mock jwt verify token function
jwt.verifyToken = jest.fn();

describe('Batch API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test

    // Mock token verification
    jwt.verifyToken.mockReturnValue({
      userId: 1,
      cartId: 1,
      username: 'admin',
      role: 'admin',
      iat: 1715447961,
    });

    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValue({
      id: 1,
      username: 'admin',
      role: 'admin',
    });
  });

  // Test to get all batches
  describe('GET /api/batches', () => {
    it('should return all batches', async () => {
      // Mock the return value of getAllBatch method
      const mockedBatches = [
        {
          batchName: 'batch1',
          expireDate: '2024-05-06T14:53:16.469Z',
          warehouse: { name: 'Warehouse A' },
          product: { name: 'Product 3' },
        },
      ];
      BatchService.getAllBatch.mockResolvedValue(mockedBatches);

      const response = await request(app)
        .get('/api/batch')
        .set('Authorization', 'Bearer fakeToken')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.batches).toEqual(mockedBatches);
    });
  });

  // Test to get expired batches
  describe('GET /api/batch/expBatch', () => {
    it('should return expired product', async () => {
      // Mock the return value of getExpireBatch method
      const mockedExpiredBatches = [
        {
          batchName: 'batch1',
          expireDate: '2024-05-06T14:53:16.469Z',
          warehouse: { name: 'Warehouse A' },
          product: { name: 'Product 3' },
        },
      ];
      BatchService.getExpireBatch.mockResolvedValue(mockedExpiredBatches);

      const response = await request(app)
        .get('/api/batch/expBatch')
        .set('Authorization', 'Bearer fakeToken')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.batches).toEqual(mockedExpiredBatches);
    });
  });
});
