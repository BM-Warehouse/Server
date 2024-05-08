/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app'); // Atur impor sesuai dengan lokasi berkas aplikasi Anda
const UserService = require('@services/user.service');
const { hashPassword } = require('@libs/bcrypt.js');

// Mock UserService
jest.mock('@services/user.service');

describe('User API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/register', () => {
    it('should create a new user', async () => {
      // Mock the implementation of createUser method
      UserService.createUser.mockImplementation(
        async (
          email,
          username,
          password,
          fullName,
          phone,
          address,
          gender,
          birthdate,
          avatar,
          role,
        ) => {
          // Simulate hash password before saving
          const hashedPassword = await hashPassword(password);
          // Return a mock user object
          return {
            id: 1,
            email,
            username,
            password: hashedPassword,
            fullName,
            phone,
            address,
            gender,
            birthdate,
            avatar,
            role,
          };
        },
      );

      // Mock data for the new user
      const newUser = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpassword',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test St',
        gender: 'male',
        birthdate: '1990-01-01',
        avatar: 'https://example.com/avatar.jpg',
        role: 'user',
      };

      // Send POST request to create a new user
      const response = await request(app).post('/api/register').send(newUser);

      // Assert the response
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id'); // Perubahan di sini
      expect(response.body.data).toHaveProperty('email', newUser.email);
      expect(response.body.data).toHaveProperty('username', newUser.username);
      expect(response.body.data).toHaveProperty('fullName', newUser.fullName);
      expect(response.body.data).toHaveProperty('phone', newUser.phone);
      expect(response.body.data).toHaveProperty('address', newUser.address);
      expect(response.body.data).toHaveProperty('gender', newUser.gender);
      expect(response.body.data).toHaveProperty('birthdate', newUser.birthdate);
      expect(response.body.data).toHaveProperty('avatar', newUser.avatar);
      expect(response.body.data).toHaveProperty('role', newUser.role);
    });
  });
});
