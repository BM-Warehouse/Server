const { NotFoundError, BadRequest } = require('@src/exceptions/error.excecptions');
const { successResponse } = require('@src/responses/responses');
const CartService = require('@src/services/cart.service');

/* eslint-disable no-empty */
class CartController {
  static async getAllCarts(req, res, next) {
    try {
      const carts = await CartService.getAllCarts();

      res
        .status(200)
        .json(successResponse({ carts }, 'Carts for all users successfully retrieved'));
    } catch (e) {
      next(e);
    }
  }

  static async showUserCart(req, res, next) {
    try {
      const { userId } = req.loggedUser;

      if (!userId) {
        throw new NotFoundError('User ID not found', 'No user was found with the specified ID');
      }

      const cart = await CartService.showUserCart(+userId);

      res.status(200).json(successResponse({ cart }, 'Cart successfully retrieved'));
    } catch (e) {
      next(e);
    }
  }

  static async addProductToCart(req, res, next) {
    try {
      if (!req.body.product) {
        throw new BadRequest('Invalid Request', 'No data provided in the request body');
      }

      const cartUser = await CartService.addProductToCart({ ...req.loggedUser, ...req.body });

      res
        .status(200)
        .json(successResponse({ cart: cartUser }, 'Product successfully added to the cart'));
    } catch (e) {
      next(e);
    }
  }
  static async deleteCartProduct(req, res, next) {
    try {
      if (isNaN(req.params.id)) {
        throw new BadRequest('Invalid parameter id', 'The provided product cart id is not valid');
      }

      const payload = {
        productCartId: +req.params.id,
        userId: +req.loggedUser.userId,
      };

      const item = await CartService.deleteCartProduct(payload);

      res.status(200).json(successResponse({ item }, 'Product item deleted successfully'));
    } catch (e) {
      next(e);
    }
  }
  static async resetCartToDefault(req, res, next) {
    try {
      const { userId } = req.loggedUser;

      if (!userId) {
        throw new NotFoundError('User ID not found', 'No user was found with the specified ID');
      }

      const item = await CartService.resetCartToDefault(+userId);

      res
        .status(200)
        .json(successResponse({ cart: item }, 'All products removed from the user cart'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CartController;
