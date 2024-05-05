const prisma = require('@libs/prisma');
const {
  InternalServerError,
  ClientError,
  NotFoundError,
} = require('@exceptions/error.excecptions');

class ProductService {
  static async getAll({ page, limit }) {
    try {
      const products = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      return products;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }

  static async getDetail(id) {
    try {
      const products = await prisma.product.findFirst({
        where: {
          id: +id,
        },
      });

      if (!products) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      return products;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to get detail of product', e);
      } else {
        throw e;
      }
    }
  }

  static async add(payload) {
    try {
      const data = payload;
      const product = await prisma.product.create({
        data,
      });
      return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }

  static async edit(payload) {
    try {
      const { id, name, description, totalStock, price, imageUrl } = payload;

      let product = await this.getDetail(id);
      if (!product) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      product = await prisma.product.update({
        data: {
          name,
          description,
          totalStock,
          price,
          imageUrl,
        },
        where: {
          id: +id,
        },
      });
      return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }

  static async delete(id) {
    try {
      let product = await this.getDetail(id);
      if (!product) {
        throw new NotFoundError('No product found', `There is no product with id ${id}`);
      }

      product = await prisma.product.delete({
        where: {
          id: +id,
        },
      });
      return product;
    } catch (e) {
      if (!(e instanceof ClientError)) {
        throw new InternalServerError('Fail to delete Product to db', e);
      } else {
        throw e;
      }
    }
  }
}

module.exports = ProductService;
