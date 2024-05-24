const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
} = require('@exceptions/error.excecptions');

class BatchService {
  //Get all batch
  static async getAllBatch(payload) {
    const { page, limit } = payload;
    try {
      const batch = await prisma.batch.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          warehouse: true,
          product: true,
        },
      });
      if (!batch) {
        throw new NotFoundError('Batch Not Found');
      }
      return batch;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get Batch data', e.message);
      } else {
        throw e;
      }
    }
  }

  // Get Expire Batch
  static async getExpireBatch(payload) {
    const { page, limit } = payload;
    try {
      const batches = await prisma.batch.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          expireDate: {
            lt: new Date(),
          },
        },
        orderBy: {
          expireDate: 'asc',
        },
        select: {
          batchName: true,
          expireDate: true,
          warehouse: {
            select: {
              name: true,
            },
          },
          product: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!batches || batches.length === 0) {
        throw new NotFoundError('Batch Not Found');
      }

      return batches;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get Batch data', e.message);
      } else {
        throw e;
      }
    }
  }
}

module.exports = BatchService;
