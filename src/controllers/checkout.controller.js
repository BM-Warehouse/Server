const CheckoutService = require('@services/checkout.service');
const { BadRequest } = require('@exceptions/error.excecptions');
const { successResponse } = require('@responses/responses');
const { getPaginationStatus } = require('@src/libs/pagination');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

class CheckoutController {
  static async getAll(req, res, next) {
    try {
      let { page, limit } = req.query;

      if ((page && isNaN(page)) || (limit && isNaN(limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      page = +page || DEFAULT_PAGE;
      limit = +limit || DEFAULT_LIMIT;

      const checkouts = await CheckoutService.getAll({
        page,
        limit,
      });
      const pagination = getPaginationStatus(page, limit, checkouts.count);
      // res.status(200).json({ message: 'ok', checkouts, pagination });
      res
        .status(200)
        .json(successResponse({ checkouts, pagination }, 'All Checkouts data retrieved'));
    } catch (e) {
      next(e);
    }
  }

  static async getDetail(req, res, next) {
    try {
      const id = req.params.checkoutId;
      const checkout = await CheckoutService.getDetail(id);
      res.status(200).json(successResponse(checkout, 'Checkout retrieved successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async add(req, res, next) {
    try {
      const checkout = await CheckoutService.add(req.body);
      res.status(201).json(successResponse(checkout, 'Checkout added successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const id = req.params.checkoutId;
      const checkout = await CheckoutService.update(id, req.body);
      res.status(200).json(successResponse(checkout, 'Checkout updated successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async remove(req, res, next) {
    try {
      const id = req.params.id;
      await CheckoutService.remove(id);
      res.status(200).json(successResponse({}, 'Checkout deleted successfully'));
    } catch (e) {
      next(e);
    }
  }

  static async action(req, res, next) {
    try {
      const productCheckout = await CheckoutService.action(req.body);
      res.status(200).json(successResponse(productCheckout, 'Checkout executed successfully'));
    } catch (e) {
      next(e);
    }
  }
  static async send(req, res, next) {
    try {
      const productCheckout = await CheckoutService.send(req.body);
      res.status(200).json(successResponse(productCheckout, 'Send checkout executed successfully'));
    } catch (e) {
      next(e);
    }
  }
  static async feedback(req, res, next) {
    try {
      const productCheckout = await CheckoutService.feedback(req.body);
      res.status(200).json(successResponse(productCheckout, 'set feedback success'));
    } catch (e) {
      next(e);
    }
  }

  static async getUserCheckouts(req, res, next) {
    try {
      const { userId } = req.loggedUser;

      const checkoutsUser = await CheckoutService.getUserCheckouts(+userId);

      res
        .status(200)
        .json(successResponse({ checkoutsUser }, 'Data all user checkouts successfully retrieved'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CheckoutController;
