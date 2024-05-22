const { BadRequest } = require('@exceptions/error.excecptions');
const { successResponse } = require('@responses/responses');
const { getPaginationStatus } = require('@src/libs/pagination');
const CourierService = require('@src/services/courier.service');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

class CourierController {
  static async getAll(req, res, next) {
    try {
      let { page, limit } = req.query;

      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      const couriers = await CourierService.getAll({
        page,
        limit,
      });

      const pagination = getPaginationStatus(page, limit, couriers.count);
      res.status(200).json(successResponse({ couriers, pagination }, 'All Courier data retrieved'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CourierController;
