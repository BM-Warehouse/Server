const prisma = require('@libs/prisma');
const { InternalServerError } = require('@exceptions/error.excecptions');

class ProductService {
  static async getAll({ page, limit }) {
    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return products;
  }

  static async getDetail(id) {
    const products = await prisma.product.findFirst({
      where: {
        id: +id,
      },
    });

    return products;
  }

  static async add(payload) {
    // const { name, description, stock, price, imageUrl } = payload;
    try {
      const data = payload;
      const product = await prisma.product.create({
        data,
      });
      return product;
    } catch (e) {
      throw new InternalServerError('Fail to Add Product to db');
    }
  }

  static async edit(payload) {}

  static async delete(id) {}
}

module.exports = ProductService;
