/* eslint-disable max-len */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const WarehouseService = require('@services/warehouse.service');
const jwt = require('@libs/jwt.js');
const bcrypt = require('@libs/bcrypt');
const AuthService = require('@services/auth.service');

// Mock UserService
jest.mock('@services/warehouse.service');

// Mock the AuthService
jest.mock('@services/auth.service');

// Mock jwt verify token function
jwt.verifyToken = jest.fn();

// Mock bcrypt hashPassword function
bcrypt.hashPassword = jest.fn();

// Mock WarehouseService
jest.mock('@services/warehouse.service');

describe('WarehouseController', () => {
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

  describe('getAllWarehouses', () => {
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

    it('should return all warehouses', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      const output = [
        { id: 1, name: 'Warehouse A' },
        { id: 2, name: 'Warehouse B' },
      ];
      const testQueryParams = { page: 1, limit: 10 };
      WarehouseService.getAllWarehouses.mockResolvedValueOnce(output);

      const response = await request(app)
        .get('/api/warehouses')
        .query(testQueryParams)
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      // expect(WarehouseService.getAllWarehouses).toHaveBeenCalledWith({ page: 1, limit: 10 });
    });
  });

  describe('getWarehouseDetail', () => {
    it('should return warehouse detail', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      const warehouse = { id: 1, name: 'Warehouse A' };
      WarehouseService.getWarehouseDetail.mockResolvedValueOnce(warehouse);

      const response = await request(app)
        .get('/api/warehouses/1')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      // expect(response.body).toEqual(warehouse);
      // expect(WarehouseService.getWarehouseDetail).toHaveBeenCalledWith('1');
    });
  });

  describe('addWarehouse', () => {
    it('should add a new warehouse', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      const newWarehouse = {
        id: 1,
        name: 'Warehouse A',
        address: '123 Main Street',
        city: 'New York',
      };
      WarehouseService.addWarehouse.mockResolvedValueOnce(newWarehouse);

      const response = await request(app)
        .post('/api/warehouses')
        .set('Authorization', 'Bearer fakeToken')
        .send(newWarehouse);

      expect(response.status).toBe(201);
      // expect(response.body).toEqual({
      //   data: newWarehouse,
      //   message: 'Added a new warehouse successfully!',
      // });
      // expect(WarehouseService.addWarehouse).toHaveBeenCalledWith(
      //   newWarehouse.name,
      //   newWarehouse.address,
      //   newWarehouse.city,
      // );
    });
  });

  describe('editWarehouse', () => {
    it('should edit a warehouse', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });
      const updatedWarehouse = {
        id: 1,
        name: 'Warehouse A',
        address: '123 Main Street',
        city: 'New York',
      };
      WarehouseService.editWarehouse.mockResolvedValueOnce(updatedWarehouse);

      const response = await request(app)
        .put('/api/warehouses/1')
        .set('Authorization', 'Bearer fakeToken')
        .send(updatedWarehouse);

      expect(response.status).toBe(200);
      // expect(response.body).toEqual({
      //   message: 'Warehouse Data Updated Successfully!',
      //   data: updatedWarehouse,
      // });
      // expect(WarehouseService.editWarehouse).toHaveBeenCalledWith(
      //   '1',
      //   updatedWarehouse.name,
      //   updatedWarehouse.address,
      //   updatedWarehouse.city,
      // );
    });
  });

  describe('deleteWarehouse', () => {
    it('should delete a warehouse', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });
      WarehouseService.deleteWarehouse.mockResolvedValueOnce();

      const response = await request(app)
        .delete('/api/warehouses/1')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      // expect(response.body.message).toMatch(/warehouse deleted successfully/i);
      // expect(WarehouseService.deleteWarehouse).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllWarehouseQuantities', () => {
    it('should return all warehouse quantities', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      const warehouseQuantities = [
        { id: 1, product: 'Product A', quantity: 10 },
        { id: 2, product: 'Product B', quantity: 20 },
      ];
      WarehouseService.productsWarehouse.mockResolvedValueOnce(warehouseQuantities);

      const response = await request(app)
        .get('/api/warehouses/quantities')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: {},
        message: 'Warehouse data successfully retrieved',
        status: 'success',
      });
    });
  });
});
