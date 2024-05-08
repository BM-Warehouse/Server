const CartService = require('@src/services/cart.service');

/* eslint-disable no-empty */
class CartController {
  static async getAllCarts(req, res, next) {
    try {
      const carts = await CartService.getAllCarts();
      res.status(200).json({
        status: 'success',
        message: 'This is the All Carts from All User',
        data: carts,
      });
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
      res.status(200).json({
        status: 'success',
        message: 'This is the Cart',
        data: userCart,
      });
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
      return res.status(200).json({
        status: 'success',
        message: 'Product item deleted successfully',
        data: item,
      });
    } catch (e) {
      next(e);
    }
  }
  static async resetCart(req, res, next) {
    try {
      const item = await CartService.resetCartToDefault(+req.user.id);
      return res.json({
        status: 'success',
        message: 'All item on the cart are deleted successfully',
        data: item,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = CartController;
