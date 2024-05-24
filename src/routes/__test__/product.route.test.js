/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const LOGIN_URL = '/api/login';
const BASE_API_URL = '/api/products';

let adminToken;
// let userToken;

beforeAll(async () => {
  let response = await request(app).post(LOGIN_URL).send({ username: 'admin', password: 'admin' });

  adminToken = response.body.accessToken;

  // response = await request(app).post(LOGIN_URL).send({ username: 'admin', password: 'admin' });
  // userToken = response.body.accessToken;
});

describe('Products Test', () => {
  let id;

  it('Get Data', async () => {
    const response = await request(app)
      .get(BASE_API_URL)
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ page: 1, limit: 5 });

    // const { products, pagination } = response.body.data;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'ok');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('products');
    expect(response.body.data).toHaveProperty('pagination');
  });

  it('Create Product', async () => {
    const name = `name${+new Date()}`;
    const response = await request(app)
      .post(BASE_API_URL)
      .send({
        name,
        description: 'Some description',
        price: 1234,
        imageUrl: 'imageUrl',
      })
      .set('Authorization', `Bearer ${adminToken}`);

    const { product } = response.body.data;
    id = product.id;
    expect(response.status).toBe(200);
    expect(product).toHaveProperty('name', name);
  });

  it('Update Product', async () => {
    const name = `edited-name${+new Date()}`;
    const response = await request(app)
      .put(`${BASE_API_URL}/${id}`)
      .send({
        id,
        name,
        description: 'Some description',
        price: 4321,
        imageUrl: 'editImageUrl',
      })
      .set('Authorization', `Bearer ${adminToken}`);

    const { product } = response.body.data;

    expect(response.status).toBe(200);
    expect(product).toHaveProperty('name', name);
    expect(product).toHaveProperty('description', 'Some description');
    expect(product).toHaveProperty('price', 4321);
    expect(product).toHaveProperty('imageUrl', 'editImageUrl');
  });

  it('Delete Product', async () => {
    const name = `edited-name${+new Date()}`;
    const response = await request(app)
      .delete(`${BASE_API_URL}/${id}`)
      .send({
        id,
        name,
        description: 'Some description',
        price: 4321,
        imageUrl: 'editImageUrl',
      })
      .set('Authorization', `Bearer ${adminToken}`);

    const { product } = response.body.data;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Products deleted successfully!');
    expect(response.body).toHaveProperty('data');
    expect(product.id).toBe(id);
  });
});
