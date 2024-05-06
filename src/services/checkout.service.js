const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
  BadRequest,
  ConflictError,
} = require('@exceptions/error.excecptions');

class CheckoutService {
  static async getAll({ page, limit }) {
    try {
      const checkouts = await prisma.checkout.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      return checkouts;
    } catch (error) {
      if (!(error instanceof ClientError)) {
        throw new InternalServerError('Fail to process products', error);
      } else {
        throw error;
      }
    }
  }

  static async getDetail(id) {
    try {
      const checkouts = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
      });

      if (!checkouts) {
        throw new NotFoundError(
          'No Product process',
          `There is no product will process with id ${id}`,
        );
      }

      return checkouts;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('failed to get details of the product being processed', e);
      } else {
        throw e;
      }
    }
  }
  static async add(payload) {
    try {
      const { total_price, status, user_id } = payload;
      if (!total_price || !status || !user_id) {
        throw new BadRequest(
          'Invalid body parameter',
          'total price, status, and user_id cannot be empty!',
        );
      }

      const existingCheckout = await prisma.checkout.findFirst({
        where: {
          user_id,
          status: {
            not: 'selesai',
          },
        },
      });

      if (existingCheckout) {
        throw new ConflictError(
          'Data conflict of checkout',
          `There is already an ongoing checkout for user with id ${user_id}`,
        );
      }

      const newCheckout = await prisma.checkout.create({
        data: {
          total_price,
          status,
          user_id,
        },
      });

      return newCheckout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to add checkout to database', e);
      } else {
        throw e;
      }
    }
  }
  static async update(id, payload) {
    try {
      const { total_price, status } = payload;
      if (!total_price || !status) {
        throw new BadRequest('Invalid body parameter', 'total price and status cannot be empty!');
      }

      let checkout = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
      });

      if (!checkout) {
        throw new NotFoundError('No Checkout found', `There is no checkout with id ${id}`);
      }

      checkout = await prisma.checkout.update({
        where: {
          id: +id,
        },
        data: {
          total_price,
          status,
        },
      });

      return checkout;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to update checkout', e);
      } else {
        throw e;
      }
    }
  }

  static async remove(id) {
    try {
      const checkout = await prisma.checkout.findFirst({
        where: {
          id: +id,
        },
      });

      if (!checkout) {
        throw new NotFoundError('No Checkout found', `There is no checkout with id ${id}`);
      }

      await prisma.checkout.delete({
        where: {
          id: +id,
        },
      });

      return { message: 'Checkout deleted successfully' };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Failed to delete checkout', e);
      } else {
        throw e;
      }
    }
  }
}

module.exports = CheckoutService;
