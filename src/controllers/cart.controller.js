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

  static async showCart(req, res, next) {
    try {
      // Ambil id dari user yg telah auth
      // const userCart = await CartService.fetchCart(+req.user.id);

      // Buat tes, ambil dri query dlu
      const id = +req.query.id;
      const userCart = await CartService.fetchCart(id);
      res.status(200).json(successResponse({ userCart }, 'This is the Cart'));
    } catch (e) {
      next(e);
    }
  }

  static async updateCart(req, res, next) {
    try {
    } catch (e) {
      next(e);
    }
  }
  static async deleteItem(req, res, next) {
    try {
      // const payload = {
      //   orderCartId: +req.params.id,
      //   id: +req.params.id,
      // };
      const payload = req.body;
      const item = await CartService.deleteCartProduct(payload);
      res.status(200).json(successResponse(item, 'Product item deleted successfully'));
    } catch (e) {
      next(e);
    }
  }
  static async resetCart(req, res, next) {
    try {
      //Buat Tes
      const item = await CartService.resetCartToDefault(+req.query.userId);

      // const item = await CartService.resetCartToDefault(+req.user.id);
      res.status(200).json(successResponse(item, 'All item on the cart are deleted successfully'));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CartController;
