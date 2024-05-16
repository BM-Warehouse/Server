/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const CheckoutService = require('@services/checkout.service');
const jwt = require('@libs/jwt.js');
const bcrypt = require('@libs/bcrypt');
const AuthService = require('@services/auth.service');

// Mocking the service
jest.mock('@services/checkout.service');

//Mock the AuthService
jest.mock('@services/auth.service');

//mock jwt verify token function
jwt.verifyToken = jest.fn();

//mock bcrypt hashPassword function
bcrypt.hashPassword = jest.fn();

describe('Checkout API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
    // Mock token verification
    jwt.verifyToken.mockReturnValueOnce({
      userId: 1,
      cartId: 1,
      username: 'admin',
      role: 'admin',
      iat: 1715447961,
    });
  });

  it('should return status code 200 if get all checkouts', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    CheckoutService.getAll.mockResolvedValueOnce([{ id: 1, name: 'Checkout 1' }]);

    const res = await request(app).get('/api/checkout').set('Authorization', 'Bearer fakeToken');

    expect(res.statusCode).toEqual(200);
    expect(CheckoutService.getAll).toHaveBeenCalled();
  });

  it('should return status code 404 if service throws an error during getAll', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    CheckoutService.getAll.mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await request(app).get('/api/checkout').set('Authorization', 'Bearer fakeToken');

    expect(res.statusCode).toEqual(404);
  });

  it('should return status code 200 if get checkout detail', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    const checkoutData = { id: 1, name: 'Checkout 1' };
    CheckoutService.getDetail.mockResolvedValueOnce(checkoutData);

    const res = await request(app).get('/api/checkout/1').set('Authorization', 'Bearer fakeToken');

    expect(res.statusCode).toEqual(200);
    // expect(res.body.data).toEqual(checkoutData);
  });

  // it('should return status code 200 if checkout detail not found', async () => {
  //   // Mock the authentication middleware
  //   AuthService.findUserById.mockResolvedValueOnce({
  //     id: 1,
  //     username: 'admin',
  //     role: 'admin',
  //   });

  //   CheckoutService.getDetail.mockResolvedValueOnce(null);

  //   const res = await request(app).get('/api/checkout/1').set('Authorization', 'Bearer fakeToken');

  //   expect(res.statusCode).toEqual(200);
  // });

  it('should return status code 201 if add checkout', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    const newCheckoutData = { name: 'New Checkout' };
    CheckoutService.add.mockResolvedValueOnce({ id: 1, ...newCheckoutData });

    const res = await request(app)
      .post('/api/checkout')
      .set('Authorization', 'Bearer fakeToken')
      .send(newCheckoutData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.name).toEqual(newCheckoutData.name);
  });

  it('should return status code 200 if update checkout', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    const updatedCheckoutData = { id: 1, name: 'Updated Checkout' };
    CheckoutService.update.mockResolvedValueOnce(updatedCheckoutData);

    const res = await request(app)
      .put('/api/checkout/1')
      .set('Authorization', 'Bearer fakeToken')
      .send(updatedCheckoutData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toEqual(updatedCheckoutData);
  });

  it('should return status code 200 if update checkout not found', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });

    CheckoutService.update.mockResolvedValueOnce(null);

    const res = await request(app)
      .put('/api/checkout/999')
      .set('Authorization', 'Bearer fakeToken')
      .send({ name: 'Updated Checkout' });

    expect(res.statusCode).toEqual(200);
  });

  it('should return status code 200 if delete checkout', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });
    CheckoutService.remove.mockResolvedValueOnce();

    const res = await request(app)
      .delete('/api/checkout/1')
      .set('Authorization', 'Bearer fakeToken');

    expect(res.statusCode).toEqual(200);
  });

  it('should return status code 200 if delete checkout not found', async () => {
    // Mock the authentication middleware
    AuthService.findUserById.mockResolvedValueOnce({
      id: 1,
      username: 'admin',
      role: 'admin',
    });
    CheckoutService.remove.mockResolvedValueOnce(null);

    const res = await request(app)
      .delete('/api/checkout/999')
      .set('Authorization', 'Bearer fakeToken');

    expect(res.statusCode).toEqual(200);
  });
});
