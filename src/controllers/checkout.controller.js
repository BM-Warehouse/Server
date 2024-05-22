const CheckoutService = require('@services/checkout.service');
const { BadRequest, NotFoundError } = require('@exceptions/error.excecptions');
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
      let filter = req.query;

      if ((filter.page && isNaN(filter.page)) || (filter.limit && isNaN(filter.limit))) {
        throw new BadRequest('Query parameter error', 'limit and page have to be a number');
      }

      filter.page = +filter.page || DEFAULT_PAGE;
      filter.limit = +filter.limit || DEFAULT_LIMIT;

      const id = req.params.checkoutId;
      const { checkout, count } = await CheckoutService.getDetail(id, filter);
      const pagination = getPaginationStatus(filter.page, filter.limit, count);

      res
        .status(200)
        .json(successResponse({ checkout, pagination }, 'Checkout retrieved successfully'));
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

  static async confirmPayment(req, res, next) {
    try {
      const id = req.params.checkoutId;
      const checkout = await CheckoutService.confirmPayment(id);
      res.status(200).json(successResponse(checkout, 'Checkout Payment Confirmed successfully'));
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

  static async getUserDetailCheckout(req, res, next) {
    try {
      const { userId } = req.loggedUser;
      const { id } = req.params;

      const checkoutDetail = await CheckoutService.getUserDetailCheckout(userId, +id);

      if (!checkoutDetail) {
        throw new NotFoundError('No Checkout Found', `Can't find Checkout with id ${id}`);
      }

      res
        .status(200)
        .json(successResponse({ checkoutDetail }, 'Checkout detail successfully retrieved'));
    } catch (err) {
      next(err);
    }
  }

  static async addProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productCheckout = await CheckoutService.addProduct(id, req.body);

      res
        .status(200)
        .json(
          successResponse({ productCheckout }, 'Data all user checkouts successfully retrieved'),
        );
    } catch (err) {
      next(err);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const productCheckout = await CheckoutService.deleteProduct(req.body);

      res.status(200).json(successResponse({ productCheckout }, 'product successfully deleted'));
    } catch (err) {
      next(err);
    }
  }

  static async editProduct(req, res, next) {
    try {
      const productCheckout = await CheckoutService.editProduct(req.body);

      res.status(200).json(successResponse({ productCheckout }, 'product successfully updated'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CheckoutController;
