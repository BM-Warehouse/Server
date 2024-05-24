const { getPaginationStatus } = require('@src/libs/pagination');
const { successResponse } = require('@src/responses/responses');
const BatchService = require('@services/batch.service');
const BadRequest = require('@exceptions/error.excecptions');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

class BatchController {
  static async getAllBatch(req, res, next) {
    try {
      let { page, limit } = req.query;
      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }
      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;
      const filter = {
        page,
        limit,
      };
      const batches = await BatchService.getAllBatch(filter);
      const pagination = getPaginationStatus(page, limit, batches.count);
      res
        .status(200)
        .json(successResponse({ batches, pagination }, 'All batches data successfully retrieved'));
    } catch (e) {
      next(e);
    }
  }

  static async getExpired(req, res, next) {
    try {
      let { page, limit } = req.query;
      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }
      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;
      const filter = {
        page,
        limit,
      };
      const batches = await BatchService.getExpireBatch(filter);
      const pagination = getPaginationStatus(page, limit, batches.count);
      res
        .status(200)
        .json(successResponse({ batches, pagination }, 'All batches data successfully retrieved'));
    } catch (e) {
      next(e);
    }
  }
}
module.exports = BatchController;
