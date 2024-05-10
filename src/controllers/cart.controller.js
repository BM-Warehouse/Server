const { successResponse } = require('@src/responses/responses');
const CartService = require('@src/services/cart.service');

/* eslint-disable no-empty */
class CartController {
  static async getAllCarts(req, res, next) {
    try {
      const carts = await CartService.getAllCarts();
      res.status(200).json(successResponse({ carts }, 'ok'));
    } catch (e) {
      next(e);
    }
  }

  static async showUserCart(req, res, next) {
    try {
      const cart = await CartService.showUserCart(+req.loggedUser.id);
      res.status(200).json(successResponse({ cart }, 'This is the Cart'));
    } catch (e) {
      next(e);
    }
  }

  static async addProductToCart(req, res, next) {
    try {
      const cartUser = await CartService.addProductToCart({ ...req.loggedUser, ...req.body });
      return res.json({
        status: 'success',
        message: 'Item added successfully',
        data: { cart: cartUser },
      });
    } catch (e) {
      next(e);
    }
  }
  static async deleteCartProduct(req, res, next) {
    try {
      const payload = {
        productCartId: +req.params.id,
        userId: +req.loggedUser.id,
      };

      const item = await CartService.deleteCartProduct(payload);
      res.status(200).json(successResponse(item, 'Product item deleted successfully'));
    } catch (e) {
      next(e);
    }
  }
  static async resetCartToDefault(req, res, next) {
    try {
      const item = await CartService.resetCartToDefault(+req.loggedUser.id);
      res.status(200).json(successResponse(item, 'All item on the cart are deleted successfully'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CartController;
