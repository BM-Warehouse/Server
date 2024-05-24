/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const LOGIN_URL = '/api/login';
const BATCH_API_URL = '/api/batch';

let adminToken;

beforeAll(async () => {
  const response = await request(app)
    .post(LOGIN_URL)
    .send({ username: 'admin', password: 'admin' });
  adminToken = response.body.accessToken;
});

describe('Batch API Tests', () => {
  it('should return all batches', async () => {
    const response = await request(app)
      .get(BATCH_API_URL)
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('batches');
  });

  it('should return expired batches', async () => {
    const response = await request(app)
      .get(`${BATCH_API_URL}/expBatch`)
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ page: 1, limit: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('batches');
  });
});
