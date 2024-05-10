/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const CheckoutService = require('@services/checkout.service');

jest.mock('@services/checkout.service'); // Mocking the service

describe('Checkout API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should return status code 200 if get all checkouts', async () => {
    CheckoutService.getAll.mockResolvedValueOnce([{ id: 1, name: 'Checkout 1' }]);

    const res = await request(app).get('/api/checkout');

    expect(res.statusCode).toEqual(200);
    expect(CheckoutService.getAll).toHaveBeenCalled();
  });

  it('should return status code 404 if service throws an error during getAll', async () => {
    CheckoutService.getAll.mockRejectedValueOnce(new Error('Internal Server Error'));

    const res = await request(app).get('/api/checkout');

    expect(res.statusCode).toEqual(404);
  });

  it('should return status code 200 if get checkout detail', async () => {
    const checkoutData = { id: 1, name: 'Checkout 1' };
    CheckoutService.getDetail.mockResolvedValueOnce(checkoutData);

    const res = await request(app).get('/api/checkout/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toEqual(checkoutData);
  });

  it('should return status code 200 if checkout detail not found', async () => {
    CheckoutService.getDetail.mockResolvedValueOnce(null);

    const res = await request(app).get('/api/checkout/999');

    expect(res.statusCode).toEqual(200);
  });

  it('should return status code 201 if add checkout', async () => {
    const newCheckoutData = { name: 'New Checkout' };
    CheckoutService.add.mockResolvedValueOnce({ id: 1, ...newCheckoutData });

    const res = await request(app).post('/api/checkout').send(newCheckoutData);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.name).toEqual(newCheckoutData.name);
  });

  it('should return status code 200 if update checkout', async () => {
    const updatedCheckoutData = { id: 1, name: 'Updated Checkout' };
    CheckoutService.update.mockResolvedValueOnce(updatedCheckoutData);

    const res = await request(app).put('/api/checkout/1').send(updatedCheckoutData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toEqual(updatedCheckoutData);
  });

  it('should return status code 200 if update checkout not found', async () => {
    CheckoutService.update.mockResolvedValueOnce(null);

    const res = await request(app).put('/api/checkout/999').send({ name: 'Updated Checkout' });

    expect(res.statusCode).toEqual(200);
  });

  it('should return status code 200 if delete checkout', async () => {
    CheckoutService.remove.mockResolvedValueOnce();

    const res = await request(app).delete('/api/checkout/1');

    expect(res.statusCode).toEqual(200);
  });

  it('should return status code 200 if delete checkout not found', async () => {
    CheckoutService.remove.mockResolvedValueOnce(null);

    const res = await request(app).delete('/api/checkout/999');

    expect(res.statusCode).toEqual(200);
  });
});
