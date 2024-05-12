/* eslint-disable max-len */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../app');
const WarehouseService = require('@services/warehouse.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('@libs/bcrypt');
const AuthService = require('@services/auth.service');

// Mock UserService
jest.mock('@services/user.service');

// Mock the AuthService
jest.mock('@services/auth.service');

// Mock jwt verify token function
jwt.verify = jest.fn();

// Mock bcrypt hashPassword function
bcrypt.hash = jest.fn();

// Mock WarehouseService
jest.mock('@services/warehouse.service');

describe('WarehouseController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllWarehouses', () => {
    it('should return all warehouses', async () => {
      AuthService.findUserById.mockResolvedValueOnce({
        id: 1,
        username: 'admin',
        role: 'admin',
      });

      const warehouses = [
        { id: 1, name: 'Warehouse A' },
        { id: 2, name: 'Warehouse B' },
      ];
      WarehouseService.getAllWarehouses.mockResolvedValueOnce(warehouses);

      jwt.verify.mockReturnValueOnce({ id: 1 });

      const response = await request(app)
        .get('/api/warehouses')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(warehouses);
      expect(WarehouseService.getAllWarehouses).toHaveBeenCalledWith({ page: 1, limit: 10 });
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

      jwt.verify.mockReturnValueOnce({ id: 1 });

      const response = await request(app)
        .get('/api/warehouses/1')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(warehouse);
      expect(WarehouseService.getWarehouseDetail).toHaveBeenCalledWith('1');
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

      jwt.verify.mockReturnValueOnce({ id: 1 });

      const response = await request(app)
        .post('/api/warehouses')
        .set('Authorization', 'Bearer fakeToken')
        .send(newWarehouse);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        data: newWarehouse,
        message: 'Added a new warehouse successfully!',
      });
      expect(WarehouseService.addWarehouse).toHaveBeenCalledWith(
        newWarehouse.name,
        newWarehouse.address,
        newWarehouse.city,
      );
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

      jwt.verify.mockReturnValueOnce({ id: 1 });

      const response = await request(app)
        .put('/api/warehouses/1')
        .set('Authorization', 'Bearer fakeToken')
        .send(updatedWarehouse);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Warehouse Data Updated Successfully!',
        data: updatedWarehouse,
      });
      expect(WarehouseService.editWarehouse).toHaveBeenCalledWith(
        '1',
        updatedWarehouse.name,
        updatedWarehouse.address,
        updatedWarehouse.city,
      );
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

      jwt.verify.mockReturnValueOnce({ id: 1 });

      const response = await request(app)
        .delete('/api/warehouses/1')
        .set('Authorization', 'Bearer fakeToken');

      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/warehouse deleted successfully/i);
      expect(WarehouseService.deleteWarehouse).toHaveBeenCalledWith('1');
    });
  });
});
