/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const AuthService = require('@services/auth.service');
const CartService = require('@services/cart.service');
const jwt = require('@libs/jwt.js');
const bcrypt = require('@libs/bcrypt');

//Mock the AuthService and CartService
jest.mock('@services/auth.service');
jest.mock('@services/cart.service');

//mock jwt verify token function
jwt.verifyToken = jest.fn();

//mock bcrypt hashPassword function
bcrypt.hashPassword = jest.fn();

describe('Cart API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cart/all', () => {
    it('should return all carts for a user', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock data cart
      const mockCartData = [{ id: 1, status: 'not checkouted', totalPrice: 0, userId: 1 }];
      CartService.getAllCarts.mockResolvedValueOnce(mockCartData);

      // Send Request with Set Bearer Token
      const response = await request(app)
        .get('/api/cart/all')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.statusCode).toBe(200);
      expect(response.body.data.carts).toEqual(mockCartData); // Perubahan di sini
    });
  });

  describe('DELETE /api/cart/:id', () => {
    it('should delete product from cart', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      // Mock token verification
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      // Mock data cart
      const mockCartData = { id: 1, userId: 1, status: 'not checkouted', totalPrice: 0 };
      CartService.deleteCartProduct.mockResolvedValueOnce(mockCartData);

      // Send Request with Set Bearer Token
      const response = await request(app)
        .delete('/api/cart/1')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual(mockCartData);
    });
  });
});
