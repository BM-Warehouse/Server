const prisma = require('@libs/prisma');

const { InternalServerError, ClientError } = require('@exceptions/error.excecptions');

class CourierService {
  static async getAll(payload) {
    const { page, limit } = payload;

    try {
      const courier = await prisma.courier.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      const count = await prisma.courier.count();
      return { courier, count };
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get couriers', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = CourierService;
