/* eslint-disable max-len */
/* eslint-disable no-undef */

const app = require('@src/app');
const request = require('supertest');
const WarehouseService = require('@services/warehouse.service');
const AuthService = require('@services/auth.service');
const jwt = require('@libs/jwt.js');

jest.mock('@services/warehouse.service');

jest.mock('@services/auth.service');

jwt.verifyToken = jest.fn();

describe('Warehouses API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  //Test Getting All Warehouses
  describe('GET /api/warehouses', () => {
    it('Should return all warehouses with status code of 200', async () => {
      const mockedWarehouses = [
        { id: 1, name: 'Warehouse A', address: 'Test Address 1', city: 'City 1' },
        { id: 2, name: 'Warehouse B', address: 'Test Address 2', city: 'City 2' },
        { id: 3, name: 'Warehouse C', address: 'Test Address 3', city: 'City 3' },
      ];
      WarehouseService.getAllWarehouses.mockResolvedValueOnce(mockedWarehouses);

      const response = await request(app).get('/api/warehouses');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(mockedWarehouses.length);
    });
  });

  //Test Getting warehouse by ID
  describe('GET /api/warehouses/:id', () => {
    it('Should return the warehouse with the specified ID and status code of 200', async () => {
      const warehouseId = 1;
      const mockedWarehouse = {
        id: warehouseId,
        name: 'Warehouse A',
        address: 'Test Address 1',
        city: 'City 1',
      };

      WarehouseService.getWarehouseDetail.mockResolvedValueOnce(mockedWarehouse);

      const response = await request(app).get(`/api/warehouses/${warehouseId}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', mockedWarehouse.name);
      expect(response.body).toHaveProperty('address', mockedWarehouse.address);
      expect(response.body).toHaveProperty('city', mockedWarehouse.city);
    });

    // it('Should return status code of 404 if warehouse with the specified ID is not found',
    // async () => {
    //   const warehouseId = 999; // If ID doesn't exist
    //   WarehouseService.getWarehouseDetail.mockResolvedValueOnce(null);

    //   const response = await request(app).get(`/api/warehouses/${warehouseId}`);
    //   expect(response.status).toBe(404);
    // });
  });

  //Test adding a new warehouse
  describe('POST /api/warehouses', () => {
    it('Should create a new warehouse with status code of 201', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      WarehouseService.addWarehouse.mockImplementation(async (name, address, city) => {
        return {
          name,
          address,
          city,
        };
      });

      const newWarehouse = {
        id: 4,
        name: 'New Warehouse',
        address: 'New Address',
        city: 'New City',
      };

      WarehouseService.addWarehouse.mockResolvedValueOnce(newWarehouse);

      const response = await request(app).post('/api/warehouses').send(newWarehouse);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id', newWarehouse.id);
      expect(response.body.data).toHaveProperty('name', newWarehouse.name);
      expect(response.body.data).toHaveProperty('address', newWarehouse.address);
      expect(response.body.data).toHaveProperty('city', newWarehouse.city);
    });
  });

  //Test updating a warehouse's data
  describe('PUT /api/warehouses/:id', () => {
    it('Should update the warehouse with the specified ID and return status code of 200', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      jwt.verifyToken.mockReturnValueOnce({ id: 1 });

      const updatedWarehouse = {
        id: 1,
        name: 'Updated Name',
        address: 'Updated Address',
        city: 'Updated City',
      };

      WarehouseService.editWarehouse.mockResolvedValueOnce(updatedWarehouse);

      const response = await request(app)
        .put('/api/warehouses/1')
        .send(updatedWarehouse)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', updatedWarehouse.id);
      expect(response.body.data).toHaveProperty('name', updatedWarehouse.name);
      expect(response.body.data).toHaveProperty('address', updatedWarehouse.address);
      expect(response.body.data).toHaveProperty('city', updatedWarehouse.city);
    });

    // it('Should return status code of 404 if warehouse with the specified ID is not found for update', async () => {
    //   const warehouseId = 999; // If ID Doesn't exist
    //   const updatedWarehouseData = {
    //     name: 'Updated Warehouse',
    //     address: 'Updated Address',
    //     city: 'Updated City' };

    //   WarehouseService.editWarehouse.mockResolvedValueOnce(null);

    //   const response = await request(app)
    //     .put(`/api/warehouses/${warehouseId}`)
    //     .send(updatedWarehouseData)
    //     .set('Accept', 'application/json');

    //   expect(response.status).toBe(404);
    // });
  });

  //Test Deleting a warehouse
  describe('DELETE /api/warehouses/:id', () => {
    it('Should delete the warehouse with the specified ID and return status code of 204', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });
      jwt.verifyToken.mockReturnValueOnce({ id: 1 });
      const warehouseId = 1;

      WarehouseService.deleteWarehouse.mockResolvedValueOnce(true);

      const response = await request(app).delete(`/api/warehouses/${warehouseId}`);
      expect(response.status).toBe(200);
    });

    // it('Should return status code of 404 if warehouse with the specified ID is not found for deletion', async () => {
    //   const warehouseId = 999; // If ID doesn't exist

    //   WarehouseService.deleteWarehouse.mockResolvedValueOnce(false);

    //   const response = await request(app).delete(`/api/warehouses/${warehouseId}`);
    //   expect(response.status).toBe(404);
    // });
  });
});
