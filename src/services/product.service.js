const prisma = require('@libs/prisma');

class ProductService {
  static async getAllProducts() {
    const products = await prisma.product.findMany();

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
