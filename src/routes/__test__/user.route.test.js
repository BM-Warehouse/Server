/* eslint-disable no-undef */
/* eslint-disable max-len */
const app = require('../../app');
const request = require('supertest');
const UserService = require('@services/user.service');
const { hashPassword } = require('@libs/bcrypt.js');

// Mock the UserService
jest.mock('@services/user.service');

const generateRandomUserData = () => ({
  email: `${Math.random().toString(36).substring(2, 10)}@example.com`,
  username: Math.random().toString(36).substring(7),
  password: Math.random().toString(36).substring(10),
  fullName: Math.random().toString(36).substring(10),
  phone: Math.random().toString().substring(2, 12),
  address: Math.random().toString(36).substring(10),
  gender: Math.random() > 0.5 ? 'male' : 'female',
  birthdate: '1990-01-01',
  avatar: `https://example.com/${Math.random().toString(36).substring(10)}.jpg`,
  role: 'user',
});

describe('User API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  // Test to get all users
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      // Mock the return value of getAllUsers method
      const mockedUsers = Array.from({ length: 5 }, generateRandomUserData);
      UserService.getAllUsers.mockResolvedValue(mockedUsers);

      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(mockedUsers.length);
    });
  });

  // Test to get detail user
  describe('GET /api/users/:id', () => {
    it('should return detail of a user', async () => {
      // Mock the return value of getDetailUser method
      const user = generateRandomUserData();
      UserService.getDetailUser.mockResolvedValue(user);

      const response = await request(app).get(`/api/users/${user.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(user);
    });

    it('should return 404 if user not found', async () => {
      // Mock the getDetailUser method to throw an error
      UserService.getDetailUser.mockRejectedValue(new Error('User not found'));

      const response = await request(app).get('/api/users/9999'); // Assuming ID 9999 doesn't exist
      expect(response.status).toBe(404);
    });
  });

  // Test to create a new user
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // Mock the createUser method to resolve
      UserService.createUser.mockImplementation(async (...args) => {
        // Hash password before saving
        args[2] = await hashPassword(args[2]);
        return generateRandomUserData();
      });

      const newUser = generateRandomUserData();
      const response = await request(app).post('/api/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User added successfully');
    });

    it('should return 404 if required fields are missing', async () => {
      // Mock the createUser method to throw an error
      UserService.createUser.mockRejectedValue(new Error('Required fields are missing'));

      const newUser = generateRandomUserData();
      delete newUser.email; // Simulate missing required field
      const response = await request(app).post('/api/users').send(newUser);
      expect(response.status).toBe(404);
    });
  });

  // Test to update a user
  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      // Mock the updateUser method to resolve
      UserService.updateUser.mockResolvedValue(generateRandomUserData());

      const updatedUser = generateRandomUserData();
      const response = await request(app).put(`/api/users/${updatedUser.id}`).send(updatedUser);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User updated successfully');
    });

    it('should return 404 if user not found', async () => {
      // Mock the updateUser method to throw an error
      UserService.updateUser.mockRejectedValue(new Error('User not found'));

      const updatedUser = generateRandomUserData();
      const response = await request(app).put('/api/users/9999').send(updatedUser); // Assuming ID 9999 doesn't exist
      expect(response.status).toBe(404);
    });
  });

  // Test to delete a user
  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      // Mock the destroyUser method to resolve
      UserService.destroyUser.mockResolvedValue();

      const userId = Math.floor(Math.random() * 1000); // Generate random category id
      const response = await request(app).delete(`/api/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return 404 if user not found', async () => {
      // Mock the destroyUser method to throw an error
      UserService.destroyUser.mockRejectedValue(new Error('User not found'));

      const nonExistentUserId = Math.floor(Math.random() * 1000); // Generate random non-existent user id
      const response = await request(app).delete(`/api/users/${nonExistentUserId}`);
      expect(response.status).toBe(404);
    });
  });
});
