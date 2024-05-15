/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const UserService = require('@services/user.service');
const jwt = require('@libs/jwt.js');
const bcrypt = require('@libs/bcrypt');
const AuthService = require('@services/auth.service');

// Mock UserService
jest.mock('@services/user.service');

//Mock the AuthService
jest.mock('@services/auth.service');

//mock jwt verify token function
jwt.verifyToken = jest.fn();

//mock bcrypt hashPassword function
bcrypt.hashPassword = jest.fn();

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock token verification
    jwt.verifyToken.mockReturnValueOnce({
      userId: 1,
      cartId: 1,
      username: 'admin',
      role: 'admin',
      iat: 1715447961,
    });
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock the return value of getAllUsers method
      UserService.getAllUsers.mockResolvedValueOnce([
        { id: 1, username: 'user1' },
        { id: 2, username: 'user2' },
      ]);

      // Send request with bearer token
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer fakeToken');

      // Assertions
      expect(response.status).toBe(200);
      // expect(response.body).toHaveProperty('users');
      // expect(Array.isArray(response.body.users)).toBeTruthy();
      // expect(response.body.users.length).toBe(2);
      // expect(response.body.users[0]).toHaveProperty('id');
      // expect(response.body.users[0]).toHaveProperty('username');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get detail of a user', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock the return value of getDetailUser method
      UserService.getDetailUser.mockResolvedValueOnce({ id: 1, username: 'user1' });

      // Send request with bearer token
      const response = await request(app)
        .get('/api/users/1')
        .set('Authorization', 'Bearer fakeToken');

      // Assertions
      expect(response.status).toBe(200);
      // expect(response.body).toHaveProperty('id');
      // expect(response.body).toHaveProperty('username');
      // expect(typeof response.body.id).toBe('number');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

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
          const hashPass = await bcrypt.hashPassword(password);
          // Return a mock user object
          return {
            id: 1,
            email,
            username,
            password: hashPass,
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
        password: 'tester123',
        fullName: 'Test User',
        phone: '1234567890',
        address: '123 Test St',
        gender: 'male',
        birthdate: '1990-01-01',
        avatar: 'https://example.com/avatar.jpg',
        role: 'user',
      };

      // Mock hashPassword to generate the expected value
      bcrypt.hashPassword.mockResolvedValueOnce('tester123');

      // Send POST request to create a new user
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', 'Bearer fakeToken')
        .send(newUser);

      // Assert the response
      expect(response.status).toBe(201);
      // expect(response.body.data).toHaveProperty('id');
      // expect(response.body.data).toHaveProperty('email', newUser.email);
      // expect(response.body.data).toHaveProperty('username', newUser.username);
      // expect(response.body.data).toHaveProperty('password', newUser.password);
      // expect(response.body.data).toHaveProperty('fullName', newUser.fullName);
      // expect(response.body.data).toHaveProperty('phone', newUser.phone);
      // expect(response.body.data).toHaveProperty('address', newUser.address);
      // expect(response.body.data).toHaveProperty('gender', newUser.gender);
      // expect(response.body.data).toHaveProperty('birthdate', newUser.birthdate);
      // expect(response.body.data).toHaveProperty('avatar', newUser.avatar);
      // expect(response.body.data).toHaveProperty('role', newUser.role);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      // Mock the authentication middleware
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock the return value of updateUser method
      UserService.updateUser.mockResolvedValueOnce({
        id: 1,
        username: 'updateduser',
        fullName: 'Updated User',
        phone: '1234567890',
        address: '123 Updated St',
        gender: 'male',
        birthdate: new Date('1990-01-01'),
        avatar: 'https://example.com/avatar.jpg',
        role: 'user',
      });

      // Send request with bearer token and updated user data
      const response = await request(app)
        .put('/api/users/1')
        .set('Authorization', 'Bearer fakeToken')
        .send({
          username: 'updateduser',
          fullName: 'Updated User',
          phone: '1234567890',
          address: '123 Updated St',
          gender: 'male',
          birthdate: '1990-01-01',
          avatar: 'https://example.com/avatar.jpg',
          role: 'user',
        });

      // Assertions
      expect(response.status).toBe(200);
      // expect(response.body.data).toHaveProperty('id', 1);
      // expect(response.body.data).toHaveProperty('username', 'updateduser');
      // expect(response.body.data).toHaveProperty('fullName', 'Updated User');
      // expect(response.body.data).toHaveProperty('phone', '1234567890');
      // expect(response.body.data).toHaveProperty('address', '123 Updated St');
      // expect(response.body.data).toHaveProperty('gender', 'male');
      // // Menyamakan langsung dengan nilai yang diharapkan
      // expect(response.body.data.birthdate).toEqual('1990-01-01T00:00:00.000Z');
      // expect(response.body.data).toHaveProperty('avatar', 'https://example.com/avatar.jpg');
      // expect(response.body.data).toHaveProperty('role', 'user');
    });
  });
});

describe('DELETE /api/users/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock token verification
    jwt.verifyToken.mockReturnValueOnce({
      userId: 1,
      cartId: 1,
      username: 'admin',
      role: 'admin',
      iat: 1715447961,
    });
  });

  it('should delete a user', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    // Mock the return value of destroyUser method
    UserService.destroyUser.mockResolvedValueOnce();

    // Send request with bearer token
    const response = await request(app)
      .delete('/api/users/1')
      .set('Authorization', 'Bearer fakeToken');

    // Assertions
    expect(response.status).toBe(200);
    // expect(response.body).toHaveProperty('message', 'User deleted successfully');
  });
});
