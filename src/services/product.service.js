const prisma = require('@libs/prisma');

class ProductService {
  static async getAllProducts({ page, limit }) {
    const products = await prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return products;
  }

  static async getProductDetail(id) {
    const products = await prisma.product.findFirst({
      where: {
        id: +id,
      },
    });

    return products;
  }
}

module.exports = ProductService;
